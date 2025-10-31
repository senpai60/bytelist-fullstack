import express from "express";
const router = express.Router();

// ===PACKAGES=== //
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

// === MODELS === //
import User from "../models/User.js";
import OTP from "../models/OTP.js";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// === SEND OTP === //
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email is required" });

  try {
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Delete any existing OTP for this email
    await OTP.deleteOne({ email });

    // Save new OTP
    await OTP.create({ email, otp });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>Valid for 5 minutes</p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// === VERIFY OTP === //
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

// === CREATE USER (Modified with OTP) === //
router.post("/create-user", async (req, res) => {
  const { username, email, password, otp } = req.body;

  if (!username || !email || !password || !otp)
    return res.status(400).json({ message: "Please fill all the fields" });

  try {
    // Verify OTP first
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(402).json({ message: "User already exists!!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    const userId = newUser._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({ message: "User registered successfully!", userId });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error please try again later!" });
  }
});

// Your existing routes...
router.get("/", async (req, res) => {
  const token = req.cookies.token;
  
  if (!token)
    return res.status(401).json({ message: "No token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user)
      return res.status(404).json({ message: "User not found" });
    
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token or server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    res.status(200).json({ message: "Logged in successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(501).json({ message: "Server error please try again later!" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/verify", async(req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "No token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await User.findById({_id: decoded.userId});
    res.status(200).json({ message: "Token valid", userId: decoded.userId, userData: userData });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
