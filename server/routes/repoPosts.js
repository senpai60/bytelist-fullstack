import express from "express";
const router = express.Router();

import jwt from 'jsonwebtoken'
import RepoPost from "../models/RepoPost.js";
import verifyUser from "../middleware/verifyUser.js";  // Import the middleware

router.get("/all-repo-posts", async (req, res) => {
  try {
    // Populate 'user' field from User model
    const repoPosts = await RepoPost.find({})
      .populate("user", "username avatar email") // only send needed fields
      .sort({ createdAt: -1 }); // optional: newest first

    res.status(200).json({ repoPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "Something went wrong, please refresh the page or try again later!",
    });
  }
});

// User-specific posts (using middleware for auth)
router.get("/user-posts", verifyUser, async (req, res) => {
  try {
    // Populate 'user' field from User model
    const repoPosts = await RepoPost.find({user: req.user})
      .populate("user", "username avatar email") // only send needed fields
      .sort({ createdAt: -1 }); // optional: newest first

    res.status(200).json({ repoPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "Something went wrong, please refresh the page or try again later!",
    });
  }
});

router.post("/create-repo-post", verifyUser, async (req, res) => {
  const { title, description, tags, image, githubUrl, liveUrl } = req.body;  // Removed 'user' from destructuring
  if (!title || !githubUrl)
    return res.status(401).json({
      message: "Bro you at least need title and the GitHub repo link :)",
    });
  try {
    const newRepoPost = await RepoPost.create({
      user: req.user,  // Use authenticated user ID from middleware
      title,
      description,
      tags,
      image,
      githubUrl,
      liveUrl,
    });
    await newRepoPost.save();
    res.status(201).json({ message: "successful", newRepoPost: newRepoPost });
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "Try again later :)" });
  }
});

export default router;
