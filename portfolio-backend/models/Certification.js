const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: String,
      required: true,
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: "",
      trim: true,
    },
    badgeIcon: {
      type: String,
      default: "",
      trim: true,
    },
    skillsVerified: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certification", certificationSchema);
