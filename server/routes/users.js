import express from "express";
const router = express.Router();

// ===PACKAGES=== //
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// === MODELS === //
import User from "../models/User.js";

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/create-user", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(401).json({ message: "Please fill all the fields" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(402).json({ message: "User already exist!!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const userId = newUser._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Only sent over HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: "/",
    });
    res.status(201).json({ message: "User Registered Successfully!", userId });
  } catch (err) {
    console.error(err);
    res
      .status(501)
      .json({ message: "server downtime please try again later!" });
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
    res.status(501).json({ message: "server downtime please try again later!" });
  }
});

// LOGOUT route - end session
router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
});

// VERIFY route - check if user is authenticated
router.get("/verify", (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "No token found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Token valid", userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
