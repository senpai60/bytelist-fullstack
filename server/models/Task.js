import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,  // In minutes or hours, inherited/modified from challenge
    required: true,
    min: 0,
  },
  attemptsAllowed: {
    type: Number,
    required: true,
    min: 0,
    default: 1,  // Limit retries for completion
  },
  attemptsUsed: {
    type: Number,
    default: 0,
    min: 0,
  },
  image: {
    type: String,  // Optional task-specific image URL from Cloudinary
    default: "",
  },
  sources: {
    type: [String],
    default: [],
  },
  experienceLevel: {
  type: [String],  // Array instead of String
  enum: ["beginner", "intermediate", "advanced"],
  default: ["beginner"],
},
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completionPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RepoPost",  // Link to the private post that completes it
    default: null,
  },
  progress: {
    type: [String],  // Array for sub-task steps, e.g., ["step1 done", "step2 pending"]
    default: [],
  },
  expireAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),  // Sync with challenge or calculate from creation
    index: { expireAfterSeconds: 0 },  // TTL index for auto-deletion
  },
}, { timestamps: true });

// Compound index to prevent duplicate claims (user can't claim same task twice)
taskSchema.index({ challenge: 1, user: 1 }, { unique: true });

// Pre-save hook to sync expiration with parent challenge (optional, call manually in route)
taskSchema.pre("save", async function (next) {
  if (this.isNew) {
    const challenge = await mongoose.model("Challenge").findById(this.challenge);
    if (challenge) {
      this.expireAt = new Date(challenge.expireAt);  // Or calculate: Date.now() + (challenge.duration * 60000)
    }
  }
  next();
});

export default mongoose.model("Task", taskSchema);
