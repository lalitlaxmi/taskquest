const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    dueDate: Date,

    completed: { type: Boolean, default: false },
    proofImage: String,
    proofNote: String,
    completedAt: Date,

    xpEarned: { type: Number, default: 0 }, // NEW

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);