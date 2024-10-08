const mongoose = require('mongoose');
const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require('../middleware/async');
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary");
const logActivity = require('../utils/logActivity');
const nodemailer = require('nodemailer');

require('dotenv').config();

const generateVerificationCode = () => Math.floor(1000 + Math.random() * 9000);

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORD,
    },
});

const createUser = async (req, res) => {
    // Step 1: Check if data is coming or not
    console.log(req.body);

    // Step 2: Destructure the data
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;

    // Step 3: Validate the incoming data
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    // Email Validation: Check if the email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // Password Complexity: Require passwords to include a combination of Uppercase letters, Lowercase letters, Numbers, Special characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must include Uppercase letters, Lowercase letters, Numbers, and Special characters (e.g., !, @, #, $)."
        });
    }

    const minPasswordLength = 8;
    if (password.length < minPasswordLength) {
        return res.status(400).json({
            success: false,
            message: `Password length must be at least ${minPasswordLength} characters.`
        });
    }

    // Confirm Password Validation: Check if the passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match."
        });
    }

    // Step 4: Try-catch block
    try {
        // Step 5: Check existing user
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken."
            });
        }

        // Password encryption
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Generate and store verification code
        const verificationCode = generateVerificationCode();

        // Send verification code via email
        try {
            const mailOptions = {
                from: process.env.USEREMAIL,
                to: email,
                subject: 'Email Verification Code',
                text: `Your verification code is ${verificationCode}`,
            };

            await transporter.sendMail(mailOptions);

        } catch (emailError) {
            console.error('Failed to send email:', emailError.message);
            return res.status(500).json({
                success: false,
                message: "Failed to send verification code. Please try again."
            });
        }

        // Step 6: Create new user
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: encryptedPassword,
            confirmPassword:encryptedPassword,
            emailVerificationToken: verificationCode,
            isVerified: false
        });

        // Update password history for the newly registered user
        newUser.passwordHistory = [encryptedPassword];
        const passwordHistoryDepth = 5;
        newUser.passwordHistory = newUser.passwordHistory.slice(-passwordHistoryDepth);

        // Step 7: Save user and respond
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User created successfully. Please verify your email."
        });

    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({
            success: false,
            message: "Server Error. Please try again later."
        });
    }
};

const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    // Step 1: Validate input
    if (!email || !verificationCode) {
        return res.status(400).json({
            success: false,
            message: "Email and verification code are required."
        });
    }

    try {
        // Step 2: Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        // Step 3: Check if the verification code matches
        if (user.emailVerificationToken !== verificationCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code."
            });
        }

        // Step 4: Mark user as verified
        user.isVerified = true;
        user.emailVerificationToken = null; // Clear the token after successful verification
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now log in."
        });

    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({
            success: false,
            message: "Server Error. Please try again later."
        });
    }
};


const loginUser = async (req, res) => {
    // Step 1: Check incoming data
    console.log(req.body);

    // Step 2: Validation
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    try {
        // Finding user
        const user = await User.findOne({ username });
        if (!user) {
            await logActivity(null, 'login_failed', { username });
            return res.status(400).json({
                success: false,
                message: "User does not exist."
            });
        }

        // Check if account is locked
        if (user.accountLocked) {
            const lockoutDurationMillis = Date.now() - user.lastFailedLoginAttempt;
            const lockoutDurationSeconds = lockoutDurationMillis / 1000; // convert to seconds

            if (lockoutDurationSeconds >= 180) { 
                // Unlock the account
                user.accountLocked = false;
                user.failedLoginAttempts = 0;
                await user.save();
            } else {
                const timeRemainingSeconds = 120 - lockoutDurationSeconds;
                const minutes = Math.floor(timeRemainingSeconds / 60);
                const seconds = Math.floor(timeRemainingSeconds % 60);

                await logActivity(user._id, 'login_failed_locked', { username });
                return res.status(400).json({
                    success: false,
                    message: `Account is locked. Please try again later after ${minutes} minutes and ${seconds} seconds.`
                });
            }
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            user.failedLoginAttempts += 1;
            user.lastFailedLoginAttempt = Date.now();

            if (user.failedLoginAttempts >= 5) {
                // Lock the account
                user.accountLocked = true;
                await user.save();
                await logActivity(user._id, 'login_failed_locked', { username });
                return res.json({
                    success: false,
                    message: "Account is locked. Please try again later."
                });
            }

            await user.save();
            await logActivity(user._id, 'login_failed', { username });
            return res.json({
                success: false,
                message: "Incorrect Password."
            });
        }

        // Reset failed login attempts and last failed login timestamp on successful login
        user.failedLoginAttempts = 0;
        user.lastFailedLoginAttempt = null;
        await user.save();

        // Check if the account is still locked after successful login
        if (user.accountLocked) {
            await logActivity(user._id, 'login_failed_locked', { username });
            return res.json({
                success: false,
                message: "Account is locked. Please try again later."
            });
        }

        // Create and send JWT token
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Log successful login activity
        await logActivity(user._id, 'login', { username });

        // Response
        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            token: token,
            userData: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred. Please try again later.",
            error: error.message
        });
    }
};

const checkPasswordExpiry = (user) => {
    const passwordExpiryDays = 90; // Set the password expiry duration in days
    const currentDate = new Date();
    const lastPasswordChangeDate = user.passwordChangeDate || user.createdAt;
  
    const daysSinceLastChange = Math.floor(
      (currentDate - lastPasswordChangeDate) / (1000 * 60 * 60 * 24)
    );
  
    const daysRemaining = passwordExpiryDays - daysSinceLastChange;
  
    if (daysRemaining <= 3 && daysRemaining > 0) {
      const message = `Your password will expire in ${daysRemaining} days. Please change your password.`;
      return {
        expired: false,
        daysRemaining: daysRemaining,
        message: message,
      };
    }
  
    return {
      expired: daysSinceLastChange >= passwordExpiryDays,
      daysRemaining: daysRemaining,
      message: null,
    };
  };

const getSingleUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            logActivity(`Failed user retrieval: User not found (${userId})`, 'user_retrieval');
            return res.status(404).json({ error: "User not found" });
        }

        const loggedInUserID = req.user.id;

        const userWithLoggedInField = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            location: user.location,
            bio: user.bio,
            userImage: user.userImageUrl,
            isUserLoggedIn: loggedInUserID === user._id.toString(),
        };

        logActivity(`User profile retrieved: ${user.username}`, 'user_profile_retrieval', user._id);

        return res.json({
            success: true,
            message: "User retrieved successfully",
            userProfile: userWithLoggedInField
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message
        });
    }
};

// Update user profile
const updateUser = async (req, res) => {
    try {
        // Step 1: Log incoming data for debugging
        console.log(req.body);
        console.log(req.files);

        // Destructuring data from the request body
        const {
            firstName,
            lastName,
            username,
            email,
            number,
            location,
            bio,
        } = req.body;

        // Extracting the uploaded image file
        const { userImage } = req.files;

        // Validate required fields
        if (!username || !email) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing!",
            });
        }

        // Prepare the updated data object
        let updatedData = {
            firstName,
            lastName,
            username,
            email,
            number,
            location,
            bio,
            updatedAt: new Date(), // Update the timestamp
        };

        // Check if a user image is provided
        if (userImage) {
            // Upload image to Cloudinary
            const uploadedImage = await cloudinary.uploader.upload(userImage.path, {
                folder: "user_profiles",
                crop: "scale",
            });
            // Add the image URL to the updated data
            updatedData.userImageUrl = uploadedImage.secure_url;
        }

        // Retrieve the user ID from the request parameters
        const userId = req.params.id;

        // Find the user by ID and update their data
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        // Check if the user was found and updated
        if (!updatedUser) {
            // Log the activity and respond with a 404 error
            logActivity(`Failed user update: User not found (${userId})`, 'user_update');
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Log the successful update activity
        logActivity(`User updated: ${updatedUser.username}`, 'user_update', updatedUser._id);

        // Respond with a success message and the updated user data
        res.json({
            success: true,
            message: "User profile updated successfully!",
            updatedUser,
        });

    } catch (error) {
        // Log the error for debugging
        console.error('Error updating user profile:', error);

        // Respond with a 500 error
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            logActivity(`Failed password update: User not found (${userId})`, 'password_update');
            return res.status(404).json({ error: "User not found" });
        }

        if (!currentPassword) {
            logActivity(`Failed password update: Current password missing`, 'password_update', user._id);
            return res.status(400).json({ error: "Current password is required" });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            logActivity(`Failed password update: Incorrect current password (${user.username})`, 'password_update', user._id);
            return res.status(400).json({ error: "Incorrect current password" });
        }

        if (newPassword !== confirmPassword) {
            logActivity(`Failed password update: Passwords do not match (${user.username})`, 'password_update', user._id);
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: "Password must include a combination of: Uppercase letters, Lowercase letters, Numbers, Special characters (e.g.,!, @, #, $)"
            });
        }

        const minPasswordLength = 8;
        if (newPassword.length < minPasswordLength) {
            return res.status(400).json({
                error: `Password length must be at least ${minPasswordLength} characters`
            });
        }

        const passwordMatchHistory = user.passwordHistory.some(async (oldPassword) => {
            return await bcrypt.compare(newPassword, oldPassword);
        });

        if (passwordMatchHistory) {
            logActivity(`Failed password update: New password matches recent password (${user.username})`, 'password_update', user._id);
            return res.status(400).json({
                error: "New password cannot be the same as any of the 5 most recent passwords."
            });
        }

        const randomSalt = await bcrypt.genSalt(10);
        const encryptedNewPassword = await bcrypt.hash(newPassword, randomSalt);

        user.password = encryptedNewPassword;
        user.passwordHistory.push(encryptedNewPassword);
        user.passwordHistory = user.passwordHistory.slice(-5);

        await user.save();

        logActivity(`Password updated: ${user.username}`, 'password_update', user._id);

        res.json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path.replace(/\\/g, '/');
    const user = await User.findByIdAndUpdate(req.user.id, { profileImage: imageUrl }, { new: true });

    if (!user) {
        logActivity(`Failed image upload: User not found (${req.user.id})`, 'image_upload');
        return res.status(404).json({ error: "User not found" });
    }

    logActivity(`Profile image uploaded: ${user.username}`, 'image_upload', user._id);

    res.json({
        success: true,
        message: "Profile image uploaded successfully",
        imageUrl,
    });
});

const logoutUser = (req, res) => {
    try {
        // Assuming token invalidation is handled client-side
        // If you are using a blacklist or any server-side token management, you would handle it here

        const username = req.user ? req.user.username : req.ip;
        const userId = req.user ? req.user.id : req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Log the logout activity
        logActivity(`User logged out: ${username}`, 'logout', userId);

        // Respond with a success message
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        const username = req.user ? req.user.username : req.ip;
        const userId = req.user ? req.user.id : req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Log the logout failure
        logActivity(`Logout failed: ${username}`, 'logout_failure', userId);

        res.status(500).json({ message: "Logout failed", error: error.message });
    }
};

module.exports = {
    createUser,
    verifyEmail,
    loginUser,
    getSingleUser,
    updateUser,
    updatePassword,
    uploadImage,
    logoutUser,
    checkPasswordExpiry
};
