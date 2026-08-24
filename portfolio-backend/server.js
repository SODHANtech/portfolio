const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const nodemailer = require("nodemailer");
const multer = require("multer");
const { Readable } = require("stream");

let gridFSBucket;

if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the environment or .env file.");
  process.exit(1);
}

const Project = require("./models/Project");
const Journey = require("./models/Journey");
const Skill = require("./models/Skill");
const Certification = require("./models/Certification");
const Profile = require("./models/Profile");
const Message = require("./models/Message");

const app = express();

// Apply security headers (configured to allow cross-origin assets like streamed images)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Restrict CORS origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Access blocked by security CORS configuration"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

// General rate limiter for read routes (max 100 requests per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { message: "Too many requests. Telemetry link throttled." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", apiLimiter);

// Administrator authorization middleware
const requireAdmin = (req, res, next) => {
  const apiKey = req.headers["x-admin-api-key"];
  const systemKey = process.env.ADMIN_API_KEY;

  if (!systemKey) {
    console.error("CRITICAL CONFIG: ADMIN_API_KEY is not defined in backend variables.");
    return res.status(500).json({ message: "Internal server config error." });
  }

  if (!apiKey || apiKey !== systemKey) {
    return res.status(401).json({ message: "Access denied. Valid credentials required." });
  }
  next();
};

const path = require("path");

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../portfolio-frontend/dist")));

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

app.get("/api/journey", async (req, res) => {
  try {
    const journey = await Journey.find().sort({ phase: 1 });
    res.json(journey);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch journey",
      error: error.message,
    });
  }
});

app.get("/api/skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
});

app.post("/api/skills", requireAdmin, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create skill",
      error: error.message,
    });
  }
});

app.get("/api/certifications", async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch certifications",
      error: error.message,
    });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

app.post("/api/profile", requireAdmin, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.json(profile);
    } else {
      profile = await Profile.create(req.body);
      return res.status(201).json(profile);
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to save profile",
      error: error.message,
    });
  }
});

// Configure memory storage for image uploading
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG and WEBP images are allowed."));
    }
    cb(null, true);
  },
});

// GET profile image read stream
app.get("/api/profile/image", async (req, res) => {
  console.log("[IMAGE_ROUTE]: Request received for profile image.");
  try {
    const profile = await Profile.findOne();
    console.log("[IMAGE_ROUTE]: Profile fetched from DB:", !!profile);
    if (!profile || !profile.profileImage || !profile.profileImage.fileId) {
      console.log("[IMAGE_ROUTE]: Profile image metadata missing.");
      return res.status(404).json({ message: "Profile image not found." });
    }

    if (!mongoose.connection.db) {
      console.log("[IMAGE_ROUTE]: mongoose.connection.db is not ready.");
      return res.status(500).json({ message: "Database connection not ready." });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "profileImages",
    });

    console.log("[IMAGE_ROUTE]: Preparing download stream for fileId:", profile.profileImage.fileId);
    res.set("Content-Type", profile.profileImage.contentType);
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(profile.profileImage.fileId)
    );

    downloadStream.on("error", (err) => {
      console.error("[IMAGE_ROUTE]: Stream download error:", err.message);
      res.status(404).json({ message: "Image stream failed." });
    });

    console.log("[IMAGE_ROUTE]: Piping download stream to response.");
    downloadStream.pipe(res);
  } catch (error) {
    console.error("[IMAGE_ROUTE]: Error in image download route:", error.message);
    res.status(500).json({ message: "Failed to download image.", error: error.message });
  }
});

// GET certification image read stream by Certification ID
app.get("/api/certifications/image/:id", async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid certification ID format." });
  }

  try {
    const cert = await Certification.findById(id);
    if (!cert) {
      return res.status(404).json({ message: "Certification not found." });
    }

    if (!cert.certificationImage || !cert.certificationImage.fileId) {
      return res.status(404).json({ message: "Certification image metadata missing." });
    }

    if (!mongoose.connection.db) {
      return res.status(500).json({ message: "Database connection not ready." });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "certifications",
    });

    res.set("Content-Type", cert.certificationImage.contentType);
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(cert.certificationImage.fileId)
    );

    downloadStream.on("error", (err) => {
      console.error("[CERT_IMAGE_ROUTE]: Stream download error:", err.message);
      res.status(404).json({ message: "Image stream failed." });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("[CERT_IMAGE_ROUTE]: Error in image download route:", error.message);
    res.status(500).json({ message: "Failed to download image." });
  }
});

// POST profile image upload (Admin protected)
app.post("/api/profile/image", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    if (!gridFSBucket) {
      return res.status(500).json({ message: "Database storage engine is initializing. Please try again." });
    }

    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ message: "Profile must exist before adding an image." });
    }

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream);

    uploadStream.on("error", (err) => {
      console.error("Upload stream error:", err.message);
      res.status(500).json({ message: "Failed to upload image to storage grid." });
    });

    uploadStream.on("finish", async () => {
      // If a previous image exists, delete it to prevent orphaned files
      if (profile.profileImage && profile.profileImage.fileId) {
        try {
          await gridFSBucket.delete(new mongoose.Types.ObjectId(profile.profileImage.fileId));
        } catch (err) {
          console.error("Failed to delete old profile image from GridFS:", err.message);
        }
      }

      profile.profileImage = {
        fileId: uploadStream.id,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      };

      await profile.save();
      res.status(200).json({
        message: "Profile image uploaded and updated successfully.",
        profileImage: profile.profileImage,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload profile image", error: error.message });
  }
});

app.post("/api/certifications", requireAdmin, async (req, res) => {
  try {
    const certification = await Certification.create(req.body);
    res.status(201).json(certification);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create certification",
      error: error.message,
    });
  }
});

app.post("/api/journey", requireAdmin, async (req, res) => {
  try {
    const journeyNode = await Journey.create(req.body);
    res.status(201).json(journeyNode);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create journey node",
      error: error.message,
    });
  }
});

app.post("/api/projects", requireAdmin, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
});
app.patch("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID identifier format." });
    }
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    message: "Too many contact submissions from this IP. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const sendNotificationEmail = async (messageData) => {
  const { name, email, subject, message, createdAt } = messageData;

  const receiver = process.env.CONTACT_RECEIVER_EMAIL || "sodhankrishnasai@gmail.com";
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    throw new Error("SMTP configuration is missing or incomplete in environment.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: `"${name} via HUD Portal" <${smtpFrom}>`,
    to: receiver,
    replyTo: email,
    subject: `New Portfolio Message: ${subject || "No Subject"}`,
    text: `--------------------------------
NEW PORTFOLIO CONTACT MESSAGE
--------------------------------

From:
${name}

Email:
${email}

Subject:
${subject || "No Subject"}

Message:
${message}

Received:
${new Date(createdAt).toLocaleString()}

--------------------------------
Portfolio Contact System
--------------------------------`,
  };

  await transporter.sendMail(mailOptions);
};

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Strict input type checking
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return res.status(400).json({ message: "Invalid payload input type format." });
    }
    if (subject && typeof subject !== "string") {
      return res.status(400).json({ message: "Invalid subject type format." });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject ? subject.trim() : "";
    const trimmedMessage = message.trim();

    if (trimmedName === "") {
      return res.status(400).json({ message: "Name is required." });
    }
    if (trimmedEmail === "") {
      return res.status(400).json({ message: "Email is required." });
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (trimmedMessage === "") {
      return res.status(400).json({ message: "Message content is required." });
    }

    // Length validation
    if (trimmedName.length > 100) {
      return res.status(400).json({ message: "Name cannot exceed 100 characters." });
    }
    if (trimmedEmail.length > 150) {
      return res.status(400).json({ message: "Email cannot exceed 150 characters." });
    }
    if (trimmedSubject.length > 150) {
      return res.status(400).json({ message: "Subject cannot exceed 150 characters." });
    }
    if (trimmedMessage.length < 10) {
      return res.status(400).json({ message: "Message content must be at least 10 characters." });
    }
    if (trimmedMessage.length > 2000) {
      return res.status(400).json({ message: "Message content cannot exceed 2000 characters." });
    }

    // Save message to MongoDB
    const newMessage = await Message.create({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    console.log(`[DATABASE_SUCCESS]: Message saved. ID: ${newMessage._id}`);

    // Try email delivery
    try {
      await sendNotificationEmail(newMessage);
      console.log(`[EMAIL_SUCCESS]: Notification delivered to recipient.`);
      
      return res.status(201).json({
        status: "SUCCESS",
        message: "Message transmitted and notification delivered successfully.",
        id: newMessage._id,
      });
    } catch (emailError) {
      console.error("[EMAIL_FAILURE]: Stored successfully in DB, but email notification delivery failed:", emailError.message);
      
      // Return 202 Accepted: Saved but notification pending/failed
      return res.status(202).json({
        status: "PARTIAL",
        message: "Message received and stored, but email notification delivery failed.",
        id: newMessage._id,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while transmitting your message.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

// All API routes are defined above, so any other request should serve the React frontend app
app.get(/.*/, (req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }
  res.sendFile(path.resolve(__dirname, "../portfolio-frontend", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Global system error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal command interface error.",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

const PORT = process.env.PORT || 5000; // Reload trigger

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "profileImages",
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });