// models/User.js

import mongoose from "mongoose";

const postModelRef = "Post";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    bio: {
      type: String,
      default: "",
      maxLength: [150, "Bio cannot be more than 150 characters."],
    },
    avatar: {
      type: String,
      default: "images/default-male.jpg",
    },
    stats: {
      posts: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      saved: {
        type: Number,
        default: 0,
      },
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: postModelRef,
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RepoPost",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: postModelRef,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
