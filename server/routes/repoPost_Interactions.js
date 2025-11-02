import express from "express";
import jwt from "jsonwebtoken";
import Archived from "../models/Archived.js";
import User from "../models/User.js";
import RepoPost from "../models/RepoPost.js";
import mongoose from "mongoose";
import verifyUser from "../middleware/verifyUser.js";  // Import the middleware

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// 🟩 POST — Save or Remove archive (using middleware for auth)
router.post("/save-to-archive", verifyUser, async (req, res) => {
  const { author, repoPost } = req.body;  // Removed 'user' from destructuring
  try {
    // Check if post already archived by this user
    const alreadyArchived = await Archived.findOne({
      user: req.user,  // Use authenticated user ID from middleware
      archivedPost: repoPost,
    });

    if (alreadyArchived) {
      await Archived.findOneAndDelete({ user: req.user, archivedPost: repoPost });
      return res.status(200).json({ message: "Removed from archive!" });
    }

    const newArchived = await Archived.create({
      user: req.user,  // Use authenticated user ID from middleware
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

// 🟦 GET — Fetch all archived posts for the logged-in user (using middleware)
router.get("/archived", verifyUser, async (req, res) => {
  try {
    // Find archived posts for this user
    const archived = await Archived.find({ user: req.user })
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

// Like a post (using middleware for auth)
router.get("/like/:repoPostId", verifyUser, async (req, res) => {
  const { repoPostId } = req.params;
  const userId = new mongoose.Types.ObjectId(req.user);  // Use authenticated user ID

  try {
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

// Dislike a post (using middleware for auth)
router.get("/dislike/:repoPostId", verifyUser, async (req, res) => {
  const { repoPostId } = req.params;
  const userId = new mongoose.Types.ObjectId(req.user);  // Use authenticated user ID

  try {
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
