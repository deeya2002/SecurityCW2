const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true
    },
    number: {
        type: String,
    },
    location: {
        type: String,
    },
    bio: {
        type: String,
    },
    userImageUrl: {
        type: String,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    accountLocked: {
        type: Boolean,
        default: false,
    },
    lastFailedLoginAttempt: {
        type: Date,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    },
    passwordHistory: [
        {
            type: String,
            required: true,
        },
    ],
    userType: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true,
    },
    // Phone verification fields
    emailVerificationToken: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Generate and hash email verification token
userSchema.methods.generateEmailVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString("hex");

    this.verificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    this.tokenExpiration = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiration

    return verificationToken;
};

// Generate and hash phone verification token
userSchema.methods.generatePhoneVerificationToken = function () {
    const verificationToken = crypto.randomBytes(4).toString("hex"); // 4 bytes is 8 hex chars, e.g., "abc12345"

    this.phoneVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    this.phoneVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

    return verificationToken;
};

module.exports = mongoose.model('users', userSchema);
