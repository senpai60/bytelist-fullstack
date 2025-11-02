import express from "express";
const router = express.Router();

import upload from "../middleware/multer.js";
import { v2 as cloudinary } from "cloudinary";

import RepoPost from "../models/RepoPost.js";
import verifyUser from "../middleware/verifyUser.js"; // Import the middleware

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
    const repoPosts = await RepoPost.find({ user: req.user })
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

router.post(
  "/create-repo-post",
  verifyUser,
  upload.single("image"),
  async (req, res) => {
    const {
      title,
      description,
      tags,
      image: imageFromBody,
      githubUrl,
      liveUrl,
    } = req.body;
    if (!title || !githubUrl)
      return res.status(401).json({
        message: "Bro you at least need title and the GitHub repo link :)",
      });
    try {
      let finalImageUrl = imageFromBody;
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const streams = cloudinary.uploader.upload_stream(
            {
              folder: "repo_posts",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          streams.end(req.file.buffer)
        });
        finalImageUrl = uploadResult.secure_url;
      }
      const existingPost = await RepoPost.findOne({
        user: req.user,
        githubUrl,
      });
      if (existingPost) {
        return res.status(409).json({
          message:
            "A post with this GitHub URL already exists for your account.",
          existingPost: existingPost, // Optional: Return the existing post details
        });
      }

      const newRepoPost = await RepoPost.create({
        user: req.user,
        title,
        description,
        tags,
        image:finalImageUrl,
        githubUrl,
        liveUrl,
      });
      await newRepoPost.save();
      res.status(201).json({ message: "successful", newRepoPost: newRepoPost });
    } catch (err) {
      console.error(err);
      res.status(502).json({ message: "Try again later :)" });
    }
  }
);

export default router;
