const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

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

// Apply security headers
app.use(helmet());

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

app.use(express.json());

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

app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API is running",
  });
});

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

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required." });
    }
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required." });
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message content is required." });
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : "",
      message: message.trim(),
    });

    console.log(`[EMAIL_HOOK_TRIGGERED]: New contact message from ${newMessage.email} persisted in DB.`);

    res.status(201).json({
      message: "Message transmitted and persisted successfully.",
      id: newMessage._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while transmitting your message.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
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

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });