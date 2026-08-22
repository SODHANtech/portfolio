const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const Certification = require("./models/Certification");

const imagePath = process.argv[2] || process.env.CERTIFICATE_IMAGE_PATH;

async function run() {
  if (!imagePath) {
    console.error("Error: Please provide the certificate image path via command-line argument or CERTIFICATE_IMAGE_PATH env variable.");
    console.error("Usage: node seed_certificate.js \"/path/to/certificate.png\"");
    process.exit(1);
  }

  const absolutePath = path.resolve(imagePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File does not exist at path: ${absolutePath}`);
    process.exit(1);
  }

  // Validate file size and extension
  const stats = fs.statSync(absolutePath);
  const maxBytes = 5 * 1024 * 1024; // 5MB limit
  if (stats.size > maxBytes) {
    console.error("Error: Certificate image exceeds maximum size limit (5MB).");
    process.exit(1);
  }

  const ext = path.extname(absolutePath).toLowerCase();
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp"];
  if (!allowedExts.includes(ext)) {
    console.error("Error: Only JPEG, PNG, and WEBP image files are allowed.");
    process.exit(1);
  }

  let contentType = "image/png";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".webp") contentType = "image/webp";

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const certName = "Agent X — The National Level Hackathon 2026";
  const existing = await Certification.findOne({ name: certName });

  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "certifications",
  });

  // If there is an existing file, delete it first to prevent orphans
  if (existing && existing.certificationImage && existing.certificationImage.fileId) {
    console.log(`Deleting existing GridFS file with ID: ${existing.certificationImage.fileId}`);
    try {
      await bucket.delete(new mongoose.Types.ObjectId(existing.certificationImage.fileId));
      console.log("Old GridFS file deleted successfully.");
    } catch (err) {
      console.warn("Warning: Could not delete old GridFS file (it may have been deleted already):", err.message);
    }
  }

  console.log(`Uploading new certificate image to GridFS...`);
  const filename = `cert_${Date.now()}${ext}`;
  const uploadStream = bucket.openUploadStream(filename, {
    contentType,
  });

  const fileId = uploadStream.id;

  await new Promise((resolve, reject) => {
    fs.createReadStream(absolutePath)
      .pipe(uploadStream)
      .on("error", (err) => reject(err))
      .on("finish", () => resolve());
  });
  console.log(`Certificate image uploaded successfully with File ID: ${fileId}`);

  const certData = {
    name: certName,
    issuer: "HackerRank Campus Crew & Vasavi College of Engineering (A)",
    issueDate: "August 2026",
    credentialUrl: "",
    skillsVerified: ["Participation", "Dedication", "Creativity", "Technical Skills", "Active Participation"],
    certificationImage: {
      fileId,
      contentType,
      filename,
    },
  };

  if (existing) {
    console.log(`Updating existing Certification document with ID: ${existing._id}`);
    await Certification.findByIdAndUpdate(existing._id, certData);
  } else {
    console.log(`Creating new Certification document...`);
    await Certification.create(certData);
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
