import mongoose from "mongoose";

const repoPostsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    tags: { type: [String], default: [] },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    dislike: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    image: {
      type: String,
      match: /^https?:\/\//,
    },
    githubUrl: {
      type: String,
      required: true,
      match: /^https?:\/\//,
    },
    liveUrl: {
      type: String,
      match: /^https?:\/\//,
    },

    // ✅ Keep only this (task reference)
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

repoPostsSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("RepoPost", repoPostsSchema);
