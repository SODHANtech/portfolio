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
    certificationImage: {
      fileId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      contentType: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certification", certificationSchema);
