const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    aboutHeading: {
      type: String,
      default: "",
      trim: true,
    },
    aboutDescription: {
      type: String,
      default: "",
      trim: true,
    },
    whoIAmTitle: {
      type: String,
      default: "",
      trim: true,
    },
    whoIAmText1: {
      type: String,
      default: "",
      trim: true,
    },
    whoIAmText2: {
      type: String,
      default: "",
      trim: true,
    },
    statCards: [
      {
        number: String,
        title: String,
        description: String,
      },
    ],
    email: {
      type: String,
      default: "",
      trim: true,
    },
    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },
    techHighlights: {
      type: [String],
      default: [],
    },
    profileImage: {
      fileId: mongoose.Schema.Types.ObjectId,
      contentType: String,
      filename: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
