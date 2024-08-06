const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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
});

  // Sign JWT and return
  userSchema.methods.getSignedJwtToken = function () {
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
    .createHash("diy234")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('users', userSchema);
module.exports = User;