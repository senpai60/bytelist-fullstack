import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    playlistName: { type: String, required: true },
    description: { type: String },
    repoPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "RepoPost" }],
    contentFrom: { type: String, enum: ["public", "challenge"] },
    tags:{type:[String],default:[]},
    accessType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
