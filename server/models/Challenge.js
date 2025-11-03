import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  image: { type: String, required: true },
  attempts: { type: Number, required: true },
  sources: { type: [String], default: [] },
  experienceLevel: { type: [String], default: "beginner" },
  expireAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: { expireAfterSeconds: 0 },
  },
},{ timestamps: true });

export default mongoose.model("Challenge", challengeSchema);
