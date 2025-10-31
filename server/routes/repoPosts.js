import express from "express";
const router = express.Router();

import jwt from 'jsonwebtoken'
import RepoPost from "../models/RepoPost.js";

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
router.get("/user-posts", async (req, res) => {
  const token = req.cookies.token;
  const decoded =  jwt.verify(token,process.env.JWT_SECRET)
  try {
    // Populate 'user' field from User model
    const repoPosts = await RepoPost.find({user:decoded.userId})
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


router.post("/create-repo-post", async (req, res) => {
  const { user, title, description, tags, image, githubUrl, liveUrl } =
    req.body;
  if (!title || !githubUrl)
    return res.status(401).json({
      message: "Bro you at least need title and the GitHub repo link :)",
    });
  try {
    const newRepoPost = await RepoPost.create({
      user,
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
