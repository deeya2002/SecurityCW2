const mongoose = require('mongoose');
const User = require("../model/usermodel")
const jwt = require("jsonwebtoken")
const { asyncHandler } = require('../middleware/async');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    // Step 1: Check if data is coming or not
    console.log(req.body);

    // Step 2: Destructure the data
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;

    // Step 3: Validate the incoming data
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Please enter all the fields."
        });
    }

    // Email Validation: Check if the email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Password Complexity: Require passwords to include a combination of Uppercase letters, Lowercase letters, Numbers, Special characters
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: "Password must include a combination of: Uppercase letters, Lowercase letters, Numbers, Special characters (e.g.,!, @, #, $)"
        });
    }

    const minPasswordLength = 8;
    if (password.length < minPasswordLength) {
        return res.status(400).json({
            error: `Password length must be at least ${minPasswordLength} characters`
        });
    }

    // Confirm Password Validation: Check if the passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            error: "Passwords do not match."
        });
    }

    // Step 4: Try-catch block
    try {
        // Step 5: Check existing user
        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            });
        }

        const existingUserByUsername = await User.findOne({ username: username });
        if (existingUserByUsername) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken."
            });
        }

        // Password encryption
        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, randomSalt);

        // Step 6: Create new user
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: encryptedPassword,
            confirmPassword: encryptedPassword,

        });

        // Update password history for the newly registered user
        newUser.passwordHistory = [encryptedPassword];
        // Trim the password history to a specific depth (e.g., last 5 passwords)
        const passwordHistoryDepth = 5;
        newUser.passwordHistory = newUser.passwordHistory.slice(-passwordHistoryDepth);

        // Step 7: Save user and respond
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User created successfully."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};


const loginUser = async (req, res) => {
    // Step 1: Check incoming data
    console.log(req.body);

    // Step 2: Validation
    const { username, password } = req.body;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    try {
        // Finding user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist."
            });
        }

        // Check if account is locked
        if (user.accountLocked) {
            const lockoutDurationMillis = Date.now() - user.lastFailedLoginAttempt;
            const lockoutDurationSeconds = lockoutDurationMillis / 1000; // convert to seconds

            if (lockoutDurationSeconds >= 120) { // 2 minutes in seconds
                // Unlock the account
                user.accountLocked = false;
                user.failedLoginAttempts = 0;
                await user.save();
            } else {
                const timeRemainingSeconds = 120 - lockoutDurationSeconds;
                const minutes = Math.floor(timeRemainingSeconds / 60);
                const seconds = Math.floor(timeRemainingSeconds % 60);

                return res.status(400).json({
                    success: false,
                    message: `Account is locked. Please try again later after ${minutes} minutes and ${seconds} seconds.`
                });
            }
        }

        // Check password expiry
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
                    message: message
                };
            }

            return {
                expired: daysSinceLastChange >= passwordExpiryDays,
                daysRemaining: daysRemaining,
                message: null
            };
        };

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment failed login attempts and update last failed login timestamp
            user.failedLoginAttempts += 1;
            user.lastFailedLoginAttempt = Date.now();

            // Check if the maximum allowed failed attempts is reached
            if (user.failedLoginAttempts >= 4) {
                // Lock the account
                user.accountLocked = true;
                await user.save();
                return res.json({
                    success: false,
                    message: "Account is locked. Please try again later."
                });
            }
            await user.save();
            return res.json({
                success: false,
                message: "Invalid credentials."
            });
        }

        // Reset failed login attempts and last failed login timestamp on successful login
        user.failedLoginAttempts = 0;
        user.lastFailedLoginAttempt = null;
        await user.save();

        // Check if the account is still locked after successful login
        if (user.accountLocked) {
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

const getSingleUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user is logged in and get the logged-in user ID
        const loggedInUserID = req.user.id;

        // Add the isUserLoggedIn field to the user object
        const userWithLoggedInField = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isUserLoggedIn: loggedInUserID === user._id.toString(),
        };

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


//update the user
const updateUser = async (req, res) => {
    const userId = req.user.id;
    const UserData = req.body;
    try {
        const user = await User.findOne({ _id: userId });
        if (user) {
            await User.findByIdAndUpdate({
                _id: userId
            }, UserData);
        } else {
            return res.json({
                success: false,
                message: "User doesnot exist."
            })
        }
        return res.json({
            success: true,
            message: "User updated."
        })
    } catch (error) {
        return res.json({
            success: false,
            message: "Server Error " + error

        })
    }

}

//update password
const updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log('Current Password:' , currentPassword)
    const userId = req.user.id;
  
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log('User Password :' , user.password)
     
          // Compare the current password with the stored hashed password
          if (!currentPassword || !user.password) {
            return res.status(400).json({ error: "Current password is required" });
        }
        
      // Compare the current password with the stored hashed password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Incorrect current password" });
      }
  
      // Check if the new password and confirm password match
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "New password and confirm password does not match" });
      }
  
      // Check if the new password is different from the current password
      if (currentPassword === newPassword) {
        return res.status(400).json({
          error: "New password must be different from the current",
        });
      }
  
      // Check if the new password is in the password history
      const isPasswordInHistory = await Promise.all(
        user.passwordHistory.map(async (oldPassword) => {
          return await bcrypt.compare(newPassword, oldPassword);
        })
      );
  
      if (isPasswordInHistory.includes(true)) {
        return res.status(400).json({
          error: "New password cannot be one of the recent.",
        });
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password and set the new password change date
      user.password = hashedNewPassword;
      user.passwordChangeDate = new Date();
  
      // Save the updated user
      await user.save();
  
      // Update the password history
      user.passwordHistory.push(hashedNewPassword);
      // Trim the password history to a specific depth (e.g., last 5 passwords)
      const passwordHistoryDepth = 5;
      user.passwordHistory = user.passwordHistory.slice(-passwordHistoryDepth);
  
      await user.save();
  
      res.status(204).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  };

const uploadImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
        success: true,
        data: req.file.filename,
    });
});



module.exports = {
    createUser,
    loginUser,
    updateUser,
    updatePassword,
    getSingleUser,
    uploadImage
}