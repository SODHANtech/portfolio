const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
  {
    phase: {
      type: Number,
      required: true,
      unique: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      default: "",
      trim: true,
    },
    institution: {
      type: String,
      default: "",
      trim: true,
    },
    branch: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
      trim: true,
    },
    objective: {
      type: String,
      default: "",
      trim: true,
    },
    whatIBuiltLearned: {
      type: String,
      default: "",
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    milestones: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Journey", journeySchema);
