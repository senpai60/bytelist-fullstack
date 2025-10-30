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
    const newUser = User.create({
      username,
      email,
      password: hashedPassword,
    });
    const userId = (await newUser)._id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token",token)
    res.status(201).json({message:"User Registered Successfully!"})
  } catch (err) {
    console.error(err);
    res
      .status(501)
      .json({ message: "server downtime please try again later!" });
  }
});

export default router;
