const mongoose = require("mongoose");
require("dotenv").config();

const Journey = require("./models/Journey");
const Skill = require("./models/Skill");
const Certification = require("./models/Certification");
const Profile = require("./models/Profile");
const Project = require("./models/Project");

const realJourney = [
  {
    phase: 1,
    label: "ORIGIN",
    title: "Computer Science & Programming Foundations",
    year: "2024 - 2025",
    institution: "VNR VJIET",
    branch: "ECE - VLSI",
    description: "Started my engineering journey at VNR VJIET in ECE - VLSI and built my programming foundation by learning C, followed by Python and SQL.",
    milestones: [
      "Started with C programming",
      "Learned Python",
      "Learned SQL",
      "Built programming fundamentals",
      "Began understanding how software and systems work"
    ],
    status: "COMPLETED"
  },
  {
    phase: 2,
    label: "BUILDER",
    title: "Backend & API Development",
    year: "2025",
    institution: "VNR VJIET",
    branch: "ECE - VLSI",
    description: "Moved from programming fundamentals into backend development, learning Flask, REST APIs, databases, and how complete applications communicate through services.",
    milestones: [
      "Learned Flask",
      "Built REST APIs",
      "Worked with databases",
      "Learned backend architecture",
      "Started building complete applications"
    ],
    status: "COMPLETED"
  },
  {
    phase: 3,
    label: "EXPLORER",
    title: "AI Systems & Agent Architecture",
    year: "2025 - 2026",
    institution: "VNR VJIET",
    branch: "ECE - VLSI",
    description: "Started exploring modern AI engineering beyond basic model usage, including agent building, multi-agent architectures, and RAG pipelines.",
    milestones: [
      "Started building AI agents",
      "Explored multi-agent architecture",
      "Learned RAG pipelines",
      "Worked with AI application architecture",
      "Connected AI systems with real applications"
    ],
    status: "IN PROGRESS"
  },
  {
    phase: 4,
    label: "ENGINEER",
    title: "Building Real-World Systems",
    year: "2025 - 2026",
    institution: "VNR VJIET",
    branch: "ECE - VLSI",
    description: "Applying programming, backend, AI, and engineering knowledge to increasingly ambitious projects involving automation, computer vision, robotics, and embedded systems.",
    milestones: [
      "Student Management System",
      "SmartCampus AI",
      "Cricket Match Analysis",
      "Gesture Control Car",
      "Campus Delivery System",
      "Smart AI Robot",
      "FPGA / Digital Logic Design work",
      "Verilog-based systems"
    ],
    status: "IN PROGRESS"
  }
];

const realSkills = [
  // Programming
  { name: "C", category: "PROGRAMMING", level: "WORKING KNOWLEDGE" },
  { name: "Python", category: "PROGRAMMING", level: "WORKING KNOWLEDGE" },
  { name: "SQL", category: "PROGRAMMING", level: "WORKING KNOWLEDGE" },
  // Backend
  { name: "Flask", category: "BACKEND", level: "WORKING KNOWLEDGE" },
  { name: "REST APIs", category: "BACKEND", level: "WORKING KNOWLEDGE" },
  // AI / Advanced Systems
  { name: "AI", category: "AI & SYSTEMS", level: "CURRENTLY EXPLORING" },
  { name: "AI Agents", category: "AI & SYSTEMS", level: "CURRENTLY EXPLORING" },
  { name: "Multi-Agent Architecture", category: "AI & SYSTEMS", level: "CURRENTLY EXPLORING" },
  { name: "RAG Pipelines", category: "AI & SYSTEMS", level: "CURRENTLY EXPLORING" },
  // Frontend / Full Stack
  { name: "React", category: "FRONTEND / FULL STACK", level: "WORKING KNOWLEDGE" },
  { name: "JavaScript", category: "FRONTEND / FULL STACK", level: "WORKING KNOWLEDGE" },
  // Database
  { name: "MongoDB", category: "DATABASE", level: "WORKING KNOWLEDGE" },
  // Systems / Engineering
  { name: "Digital Logic Design", category: "HARDWARE & SYSTEMS", level: "CURRENTLY EXPLORING" },
  { name: "Verilog", category: "HARDWARE & SYSTEMS", level: "CURRENTLY EXPLORING" },
  { name: "FPGA", category: "HARDWARE & SYSTEMS", level: "CURRENTLY EXPLORING" },
  // Development
  { name: "Git", category: "DEVELOPMENT", level: "WORKING KNOWLEDGE" }
];

const realProfile = {
  name: "Sodhan Krishna Sai",
  headline: "FULL-STACK DEVELOPER",
  description: "A developer and engineering student at VNR VJIET exploring full-stack development, AI systems, backend engineering, and hardware-oriented projects.",
  aboutHeading: "Building things that are useful, modern, and real.",
  aboutDescription:
    "I'm a B.Tech ECE - VLSI student at VNR VJIET, currently in my second year, exploring software development, backend systems, AI engineering, and hardware-oriented technologies. I enjoy learning by building real projects and understanding how different parts of a system work together.",
  whoIAmTitle: "Developer. Builder. Engineer.",
  whoIAmText1:
    "My journey started with programming fundamentals in C, Python, and SQL and gradually moved toward backend development, REST APIs, AI agents, multi-agent systems, and RAG pipelines.",
  whoIAmText2:
    "Alongside software development, I'm also exploring digital logic, Verilog, FPGA systems, robotics, computer vision, and practical engineering projects.",
  statCards: [
    {
      number: "01",
      title: "ACADEMIC FOUNDATION",
      description: "ECE - VLSI at VNR VJIET"
    },
    {
      number: "02",
      title: "FULL-STACK + AI",
      description: "Backend, REST APIs, agents and RAG systems"
    },
    {
      number: "03",
      title: "HARDWARE + SOFTWARE",
      description: "Verilog, FPGA, robotics and software systems"
    }
  ],
  email: "", // Empty to hide placeholder mail link
  githubUrl: "https://github.com/SODHANtech",
  linkedinUrl: "",
  techHighlights: ["C", "Python", "SQL", "Flask", "REST APIs", "AI Agents", "React", "Node.js", "Verilog", "FPGA"]
};

const realProjects = [
  {
    title: "Student Management System",
    tagline: "Management platform for student records and services",
    description: "A database-driven system to manage student details, records, and academy operations.",
    category: "SOFTWARE SYSTEMS",
    techStack: ["Python", "SQL"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    status: "COMPLETED"
  },
  {
    title: "SmartCampus AI",
    tagline: "Connecting college services with AI-powered solutions",
    description: "An AI-powered student management platform designed to connect college services, improve communication, and solve campus connectivity problems.",
    category: "AI / FULL STACK",
    techStack: ["React", "Node.js", "Express", "MongoDB", "AI"],
    githubUrl: "https://github.com/SODHANtech/stdent-management",
    liveUrl: "",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhxJDnr4OYh3O2xqiWSR0drxCUk01cjpmZ4PU-3IxR2Q&s=10",
    featured: true,
    status: "IN DEVELOPMENT"
  },
  {
    title: "Cricket Match Analysis",
    tagline: "Data analytics tool for match statistics and player performance",
    description: "Analyzing match statistics, scores, and player statistics using Python.",
    category: "DATA ANALYSIS",
    techStack: ["Python"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    status: "COMPLETED"
  },
  {
    title: "Gesture Control Car",
    tagline: "Gesture-based remote vehicle control system",
    description: "Building a remote gesture-controlled vehicle using microcontrollers and computer vision tracking.",
    category: "ROBOTICS / EMBEDDED",
    techStack: ["Python", "AI"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    status: "COMPLETED"
  },
  {
    title: "Campus Delivery System",
    tagline: "Automated parcel delivery tracking system for campuses",
    description: "A campus logistics routing and delivery planning system.",
    category: "SOFTWARE SYSTEMS",
    techStack: ["Python"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    status: "IN DEVELOPMENT"
  },
  {
    title: "Smart AI Robot",
    tagline: "Autonomous robot with vision and intelligence",
    description: "Integrating microcontrollers, computer vision, and local AI agent reasoning into a physical robot chassis.",
    category: "ROBOTICS / AI",
    techStack: ["Python", "AI", "AI Agents"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: true,
    status: "IN DEVELOPMENT"
  },
  {
    title: "FPGA / Digital Logic Design",
    tagline: "Digital circuit designs implemented on hardware",
    description: "Designing combinatorial and sequential digital logic circuits on FPGA development boards.",
    category: "HARDWARE / DIGITAL SYSTEMS",
    techStack: ["Digital Logic Design", "Verilog", "FPGA"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    status: "COMPLETED"
  },
  {
    title: "Verilog hardware systems",
    tagline: "Hardware description modules and digital architectures",
    description: "Implementing digital processing units and hardware controllers using Verilog HDL.",
    category: "HARDWARE / DIGITAL SYSTEMS",
    techStack: ["Verilog", "FPGA"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    featured: false,
    status: "COMPLETED"
  },
  {
    title: "Full-Stack Portfolio",
    tagline: "A personal portfolio web app with React, Node.js, and MongoDB.",
    description: "A personal portfolio web app with React, Node.js, and MongoDB.",
    category: "FULL STACK",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    githubUrl: "https://github.com/SODHANtech",
    liveUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
    featured: false,
    status: "COMPLETED"
  }
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully.");

    // 1. Clean up and Seed Journey collection
    console.log("Cleaning up and seeding Journey...");
    await Journey.deleteMany({});
    const createdJourney = await Journey.insertMany(realJourney);
    console.log(`Seeded ${createdJourney.length} Journey phases.`);

    // 2. Clean up and Seed Skills
    console.log("Cleaning up and seeding Skills...");
    await Skill.deleteMany({});
    const createdSkills = await Skill.insertMany(realSkills);
    console.log(`Seeded ${createdSkills.length} Skills.`);

    // 3. Clean up Certifications (ensure it remains empty)
    console.log("Cleaning up Certifications...");
    await Certification.deleteMany({});
    console.log("Certifications collection cleared.");

    // 4. Clean up and Seed Profile
    console.log("Cleaning up and seeding Profile configuration...");
    await Profile.deleteMany({});
    const profileDoc = await Profile.create(realProfile);
    console.log(`Seeded global profile document for: ${profileDoc.name}`);

    // 5. Clean up and Seed Projects
    console.log("Cleaning up and seeding Projects...");
    await Project.deleteMany({});
    const createdProjects = await Project.insertMany(realProjects);
    console.log(`Seeded ${createdProjects.length} Projects.`);

    console.log("Database content correction completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

seed();
