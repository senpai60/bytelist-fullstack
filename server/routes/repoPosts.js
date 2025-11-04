import express from "express";
const router = express.Router();
import axios from 'axios';

import upload from "../middleware/multer.js";
import { v2 as cloudinary } from "cloudinary";

import RepoPost from "../models/RepoPost.js";
import verifyUser from "../middleware/verifyUser.js"; // Import the middleware

import Task from "../models/Task.js";

const SERVER_URI = process.env.SERVER_URI || "http://localhost:300"

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
      taskId,
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

    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task)
        return res
          .status(401)
          .json({
            message:
              "No Task found :(  please try to add from the challenges section!",
          });
      if (task.isPermanentlyDisabled)
        return res
          .status(401)
          .json({
            message:
              "task permanently disabled because no attempts left or challenge ended :(",
          });
    }

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
          streams.end(req.file.buffer);
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
        image: finalImageUrl,
        githubUrl,
        liveUrl,
        taskId: taskId,
      });
      await newRepoPost.save();
      if (taskId) {
        await Task.findByIdAndUpdate(taskId, {
          isCompleted: true,
          isPermanentlyDisabled:true,
          completionPost: newRepoPost._id
        })
        const aiResponse = await axios.get(`${SERVER_URI}/ai/analyze-repo/${newRepoPost._id}`,{withCredentials:true})
        console.log(aiResponse.data);
        
      }
      res.status(201).json({ message: "successful", newRepoPost: newRepoPost });
    } catch (err) {
      console.error(err);
      res.status(502).json({ message: "Try again later :)" });
    }
  }
);
router.put("/update", verifyUser, upload.single("image"), async (req, res) => {
  const {
    repoPostId,
    title,
    description,
    tags,
    image: imageFromBody, // Optional: for URL-only updates without file
    githubUrl,
    liveUrl,
  } = req.body;

  if (!repoPostId) {
    return res.status(400).json({ message: "Repo post ID is required." });
  }

  try {
    // Find the existing post and verify ownership
    const post = await RepoPost.findById(repoPostId).populate(
      "user",
      "username"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.user._id.toString() !== req.user.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You can only update your own posts." });
    }

    // Prepare update object
    const updateData = {
      title: title || post.title,
      description: description || post.description,
      tags: tags || post.tags,
      githubUrl: githubUrl || post.githubUrl,
      liveUrl: liveUrl || post.liveUrl,
    };

    let finalImageUrl = post.image;
    let finalImagePublicId = post.imagePublicId;

    // Handle new image upload if file is provided
    if (req.file) {
      // Delete old image if it exists
      if (post.imagePublicId) {
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(
            post.imagePublicId,
            { invalidate: true },
            (error, result) => {
              if (error) {
                console.error("Error deleting old image:", error);
                reject(error);
              } else {
                console.log("Old image deleted:", result);
                resolve(result);
              }
            }
          );
        });
      }

      // Upload new image
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
        streams.end(req.file.buffer);
      });

      finalImageUrl = uploadResult.secure_url;
      finalImagePublicId = uploadResult.public_id;
    } else if (imageFromBody && imageFromBody !== post.image) {
      // Optional: Handle direct URL update (e.g., from external source), clear public ID
      finalImageUrl = imageFromBody;
      finalImagePublicId = null; // Since it's not from Cloudinary
    }

    // Add image fields to update
    updateData.image = finalImageUrl;
    updateData.imagePublicId = finalImagePublicId;

    // Optional: Check for duplicate GitHub URL (excluding current post)
    if (githubUrl && githubUrl !== post.githubUrl) {
      const existingPost = await RepoPost.findOne({
        user: req.user,
        githubUrl,
        _id: { $ne: repoPostId }, // Exclude current post
      });
      if (existingPost) {
        return res.status(409).json({
          message:
            "A post with this GitHub URL already exists for your account.",
        });
      }
    }

    // Perform the update
    const updatedPost = await RepoPost.findByIdAndUpdate(
      repoPostId,
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "username avatar email");

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later!" });
  }
});

export default router;
