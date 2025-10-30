import mongoose from "mongoose";

const repoPostsSchema = mongoose.Schema(
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
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      match: /^https?:\/\//,
    },
    repoUrl: {
      type: String,
      required: true,
      match: /^https?:\/\//,
    },
    liveUrl: {
      type: String,
      match: /^https?:\/\//,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

repoPostsSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("RepoPost", repoPostsSchema);
