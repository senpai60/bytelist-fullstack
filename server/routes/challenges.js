import express from "express";
const router = express.Router();

import upload from "../middleware/multer.js";
import verifyUser from "../middleware/verifyUser.js";
import { v2 as cloudinary } from "cloudinary"; // Configure in your env

// DB
import Challenge from "../models/Challenge.js";

// GET all active challenges (exclude expired)
router.get("/", async (req, res) => {
  try {
    const currentTime = new Date();
    const challenges = await Challenge.find({ expireAt: { $gt: currentTime } })
      .populate("creator", "username avatar _id")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ challenges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong, please try again later!" });
  }
});
router.get("/:challengeId", async (req, res) => {
  const {challengeId} = req.params
  try {
    const challenge = await Challenge.findById(challengeId)
      .populate("creator", "username avatar _id" )
      
    res.status(200).json({ challenge });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong, please try again later!" });
  }
});

// POST create challenge
router.post(
  "/create-challenge",
  verifyUser,
  upload.single("image"),
  async (req, res) => {
    const {
      title,
      description,
      duration,
      attempts,
      experienceLevel,
      sources,
      image: imageFromBody,
    } = req.body;

    // Validation
    const missingFields = [];
    if (!title || title.trim() === "") missingFields.push("title");
    if (!description || description.trim() === "") missingFields.push("description");
    if (!duration || isNaN(duration) || Number(duration) <= 0) missingFields.push("duration");
    if (!attempts || isNaN(attempts) || Number(attempts) < 0) missingFields.push("attempts");
    if (!experienceLevel || experienceLevel.trim() === "") missingFields.push("experienceLevel");
    if (!sources || sources.trim() === "") missingFields.push("sources");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing or invalid required fields",
        missing: missingFields,
        message: "Please provide valid values for all required fields.",
      });
    }

    try {
      // Handle image upload to Cloudinary (using buffer like reference)
      let finalImageUrl = imageFromBody;
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "challenges",
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
          stream.end(req.file.buffer);
        });
        finalImageUrl = uploadResult.secure_url;
      }

      if (!finalImageUrl) {
        return res.status(400).json({
          error: "Image required",
          message: "Please upload an image or provide a valid image URL."
        });
      }

      // Duplicate check (title + creator)
      const existingChallenge = await Challenge.findOne({
        title: title.trim(),
        creator: req.user,
      });
      if (existingChallenge) {
        return res.status(409).json({
          message: "A challenge with this title already exists for your account.",
          existingChallenge,
        });
      }

      // Prepare data
      const challengeData = {
        creator: req.user,
        title: title.trim(),
        description: description.trim(),
        duration: Number(duration),
        image: finalImageUrl,
        attempts: Number(attempts),
        sources: sources ? sources.split(",").map(s => s.trim()).filter(Boolean) : [],
        experienceLevel: experienceLevel ? experienceLevel.split(",").map(l => l.trim()).filter(Boolean) : ["beginner"],
      };

      const newChallenge = await Challenge.create(challengeData);
      await newChallenge.save(); // Ensures indexes apply

      // Populate for response
      const populatedChallenge = await Challenge.findById(newChallenge._id)
        .populate("creator", "username avatar _id")
        .lean();

      res.status(201).json({ message: "Challenge created successfully", challenge: populatedChallenge });
    } catch (err) {
      console.error(err);
      if (err.code === 11000) { // Duplicate key error from index
        return res.status(409).json({ message: "Duplicate challenge title for this creator." });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({
          error: "Validation failed",
          details: Object.values(err.errors).map(e => e.message),
        });
      }
      res.status(500).json({ message: "Something went wrong, please try again later!" });
    }
  }
);

// PUT update challenge (optional, following reference pattern)
router.put("/update-challenge", verifyUser, upload.single("image"), async (req, res) => {
  const {
    challengeId,
    title,
    description,
    duration,
    attempts,
    experienceLevel,
    sources,
    image: imageFromBody,
  } = req.body;

  if (!challengeId) {
    return res.status(400).json({ message: "Challenge ID is required." });
  }

  try {
    // Find and verify ownership
    const challenge = await Challenge.findById(challengeId).populate("creator", "username avatar _id");
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found." });
    }
    if (challenge.creator._id.toString() !== req.user.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own challenges." });
    }

    // Prepare update data
    const updateData = {
      title: title ? title.trim() : challenge.title,
      description: description ? description.trim() : challenge.description,
      duration: duration ? Number(duration) : challenge.duration,
      attempts: attempts ? Number(attempts) : challenge.attempts,
      sources: sources ? sources.split(",").map(s => s.trim()).filter(Boolean) : challenge.sources,
      experienceLevel: experienceLevel ? experienceLevel.split(",").map(l => l.trim()).filter(Boolean) : challenge.experienceLevel,
    };

    let finalImageUrl = challenge.image;
    // Handle new image upload if provided
    if (req.file) {
      // Note: For updates, you'd ideally store and delete public_id like in reference
      // Assuming you add imagePublicId to schema for this
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "challenges", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      finalImageUrl = uploadResult.secure_url;
      updateData.image = finalImageUrl;
    } else if (imageFromBody && imageFromBody !== challenge.image) {
      updateData.image = imageFromBody;
    }

    // Duplicate check (excluding current)
    if (title && title.trim() !== challenge.title) {
      const existing = await Challenge.findOne({
        title: title.trim(),
        creator: req.user,
        _id: { $ne: challengeId },
      });
      if (existing) {
        return res.status(409).json({ message: "A challenge with this title already exists." });
      }
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      challengeId,
      updateData,
      { new: true, runValidators: true }
    ).populate("creator", "username avatar _id").lean();

    res.status(200).json({ message: "Challenge updated successfully", challenge: updatedChallenge });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate challenge title." });
    }
    res.status(500).json({ message: "Something went wrong, please try again later!" });
  }
});

export default router;
