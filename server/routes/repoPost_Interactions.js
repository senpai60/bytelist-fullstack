import express from "express";
import jwt from "jsonwebtoken";
import Archived from "../models/Archived.js";
import User from "../models/User.js";
import RepoPost from "../models/RepoPost.js";

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// 🟩 POST — Save or Remove archive
router.post("/save-to-archive", async (req, res) => {
  const { user, author, repoPost } = req.body;
  try {
    // Check if post already archived by this user
    const alreadyArchived = await Archived.findOne({
      user,
      archivedPost: repoPost,
    });

    if (alreadyArchived) {
      await Archived.findOneAndDelete({ user, archivedPost: repoPost });
      return res.status(200).json({ message: "Removed from archive!" });
    }

    const newArchived = await Archived.create({
      user,
      author,
      archivedPost: [repoPost],
    });

    res.status(201).json({ message: "Post archived", data: newArchived });
  } catch (err) {
    console.error(err);
    res
      .status(502)
      .json({ message: "Server downtime, please try again later!" });
  }
});

// 🟦 GET — Fetch all archived posts for the logged-in user
router.get("/archived", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please sign in to view archived posts" });
    }

    // Decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res
        .status(403)
        .json({ message: "Invalid or expired token, please log in again" });
    }

    // Find archived posts for this user
    const archived = await Archived.find({ user: decoded.userId })
      .populate("archivedPost") // Optional — to fetch full post details
      .populate("author", "username avatar") // Optional
      .sort({ createdAt: -1 });

    res.status(200).json({ archivedPosts: archived });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching archived posts",
      error: err.message,
    });
  }
});

import mongoose from "mongoose";

router.get("/like/:repoPostId", async (req, res) => {
  const { repoPostId } = req.params;
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Please login to like post" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = new mongoose.Types.ObjectId(decoded.userId);

    const repoPost = await RepoPost.findById(repoPostId);
    if (!repoPost) return res.status(404).json({ message: "Post not found" });

    const hasLiked = repoPost.likes.some(id => id.equals(userId));
    const hasDisliked = repoPost.dislike.some(id => id.equals(userId));

    if (hasLiked) {
      // Remove like
      repoPost.likes = repoPost.likes.filter(id => !id.equals(userId));
      await repoPost.save();
      return res.status(200).json({ message: "Like removed" });
    }

    if (hasDisliked) {
      // Remove dislike if exists
      repoPost.dislike = repoPost.dislike.filter(id => !id.equals(userId));
    }

    // Add like
    repoPost.likes.push(userId);
    await repoPost.save();

    res.status(200).json({ message: "Liked the post" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dislike/:repoPostId", async (req, res) => {
  const { repoPostId } = req.params;
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Please login to dislike post" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId =new mongoose.Types.ObjectId(decoded.userId);

    const repoPost = await RepoPost.findById(repoPostId);
    if (!repoPost) return res.status(404).json({ message: "Post not found" });

    const hasDisliked = repoPost.dislike.some(id => id.equals(userId));
    const hasLiked = repoPost.likes.some(id => id.equals(userId));

    if (hasDisliked) {
      // Remove dislike
      repoPost.dislike = repoPost.dislike.filter(id => !id.equals(userId));
      await repoPost.save();
      return res.status(200).json({ message: "Dislike removed" });
    }

    if (hasLiked) {
      // Remove like if exists
      repoPost.likes = repoPost.likes.filter(id => !id.equals(userId));
    }

    // Add dislike
    repoPost.dislike.push(userId);
    await repoPost.save();

    res.status(200).json({ message: "Disliked the post" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
