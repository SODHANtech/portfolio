const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    tagline: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "FULL STACK",
      trim: true,
    },

    techStack: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      default: "",
    },

    liveUrl: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "BUILDING",
      trim: true,
    },

    tier: {
      type: String,
      enum: ["flagship", "secondary", "experimental"],
      default: "secondary",
      trim: true,
    },

    purpose: {
      type: String,
      default: "",
      trim: true,
    },

    problemSolved: {
      type: String,
      default: "",
      trim: true,
    },

    architectureType: {
      type: String,
      default: "MERN",
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    security: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);