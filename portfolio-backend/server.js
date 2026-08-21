const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.use(cors());
app.use(express.json());

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

app.post("/api/skills", async (req, res) => {
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

app.post("/api/profile", async (req, res) => {
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

app.post("/api/certifications", async (req, res) => {
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

app.post("/api/journey", async (req, res) => {
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

app.post("/api/projects", async (req, res) => {
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
app.patch("/api/projects/:id", async (req, res) => {
  try {
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

const rateLimit = require("express-rate-limit");

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

const PORT = process.env.PORT || 5000;

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