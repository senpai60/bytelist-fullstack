import mongoose from "mongoose";

const archivedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  archivedPost: { type: [mongoose.Schema.Types.ObjectId], ref: "RepoPost" },
});

export default mongoose.model("Archived",archivedSchema)
