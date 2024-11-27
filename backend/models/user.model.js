import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: function(v) {
                return validator.isStrongPassword(v, { minLength: 8, minSymbols: 1 });
            },
            message: "Password must be at least 8 characters long and include at least one symbol",
        },
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters long"],
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiresAt: {
        type: Date,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiresAt: {
        type: Date,
    },
    provider: { 
        type: String, 
        enum: ['google', 'github', 'local'], 
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, 
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);