import express from "express";
import jwt from "jsonwebtoken";
import Archived from "../models/Archived.js";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

export default router;
