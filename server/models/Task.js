import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true, min: 0 }, // in minutes

    // ✅ Duration ends from creation + duration
    durationEndsAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + this.duration * 60 * 1000);
      },
    },

    attemptsAllowed: { type: Number, default: 1, min: 0 },
    attemptsUsed: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    sources: { type: [String], default: [] },
    experienceLevel: {
      type: [String],
      enum: ["beginner", "intermediate", "advanced"],
      default: ["beginner"],
    },
    isCompleted: { type: Boolean, default: false },
    isRemovedFromTask: { type: Boolean, default: false },
    isPermanentlyDisabled: { type: Boolean, default: false },

    completionPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepoPost",
      default: null,
    },
    progress: { type: [String], default: [] },

    // ✅ Expiry (challenge-based auto delete)
    expireAt: {
      type: Date,
      default: function () {
        // Fallback: 24h after creation if no challenge found
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

// ✅ Ensure unique task per challenge-user pair
taskSchema.index({ challenge: 1, user: 1 }, { unique: true });

// ✅ Pre-save hook to sync expiration from challenge
taskSchema.pre("save", async function (next) {
  if (this.isNew) {
    const challenge = await mongoose.model("Challenge").findById(this.challenge);
    if (challenge?.expireAt) {
      this.expireAt = challenge.expireAt;
    }
  }
  next();
});

export default mongoose.model("Task", taskSchema);
