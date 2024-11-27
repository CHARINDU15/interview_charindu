import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { genarateverificationToken } from "../utills/genarateverificationCode.js";
import { genarateTokenAndSetCookie } from "../utills/genarateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/email.js";
import dotenv from "dotenv";
import axios from "axios";
import { validationResult } from 'express-validator';

dotenv.config();


export const signup = async (req, res) => {
  const { email, password, name,recaptchaToken } = req.body;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array().map(error => error.msg) 
    });
  }

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const responsed = await axios.post(verificationUrl);
    const { success } = responsed.data;

    if (!success) {
      return res.status(400).json({ error: "ReCAPTCHA validation failed." });
    }
    const userAlreadyExists = await User.findOne({ email });
    console.log("userAlreadyExists", userAlreadyExists);
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ sucess: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = genarateverificationToken();
    console.log("verificationToken", verificationToken);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      provider: "local",

    });
    console.log("user", user);
    await user.save();

    //jwt token

    const token = genarateTokenAndSetCookie(res, user);

    sendVerificationEmail(user.email, user.verificationToken);

    res.status(201).json({
      sucess: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  // _ _ _ _ _ _
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }, // $gt = greater than today so thats valied
    });

    if (!user) {
      return res
        .status(400)
        .json({
          sucess: false,
          message: "Invalid or expired verification code Haven't a user ",
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    const token = genarateTokenAndSetCookie(res, user);

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      sucess: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password,recaptchaToken } = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
  const responsed = await axios.post(verificationUrl);
  const { success } = responsed.data;

  if (!success) {
    return res.status(400).json({ error: "ReCAPTCHA validation failed." });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array().map(error => error.msg) 
    });
  }

  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ sucess: false, message: "Email not verified" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ sucess: false, message: "Invalid credentials" });
    }

    const token = genarateTokenAndSetCookie(res, user);

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({
      sucess: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    sucess: true,
    message: "Logged out successfully",
  });
};

export const forgotpassword = async (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array().map(error => error.msg) 
    });
  }

  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ sucess: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      sucess: true,
      message: "Password reset email sent successfully!!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

export const resetpassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: errors.array().map(error => error.msg) 
    });
  }

  
  try {
    if (!password) {
      throw new Error("Password is required");
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }, // $gt = greater than today so thats valied
    });
    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).json({
      sucess: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(400).json({ sucess: false, message: "User not found" });
    }

    res.status(200).json({
      sucess: true,
      user,
      
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

export const googleOAuth = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Validate incoming data
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, create a new user
      const hashedPassword = await bcryptjs.hash(password, 10); // Hash password
      user = new User({
        name,
        email,
        password: hashedPassword, // Store hashed password
        provider: "google",
        isVerified: true,
      });

      // Save the new user
      await user.save();
    }

    const token = genarateTokenAndSetCookie(res, user);


    // Send response back to the client
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
        token,
      },
    });
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message, // Include the error message for debugging
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};