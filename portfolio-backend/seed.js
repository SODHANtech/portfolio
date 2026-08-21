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
  {
    name: "C",
    category: "PROGRAMMING",
    level: "WORKING KNOWLEDGE",
    description: "Low-level system programming and firmware design foundation.",
    role: "Hardware interfacing and algorithmic optimization.",
    projects: ["FPGA / Digital Logic Design"],
    experience: "Academic programming foundations at VNR VJIET."
  },
  {
    name: "Python",
    category: "PROGRAMMING",
    level: "WORKING KNOWLEDGE",
    description: "Extensive scripting, AI model integration, and automation capability.",
    role: "AI agent orchestrations, computer vision tracking, and statistical analytics.",
    projects: ["Smart AI Robot", "Gesture Control Car", "Student Management System", "Cricket Match Analysis"],
    experience: "Main programming language for all AI and automation modules."
  },
  {
    name: "SQL",
    category: "PROGRAMMING",
    level: "WORKING KNOWLEDGE",
    description: "Relational database querying and management.",
    role: "Designing tabular schemas and writing complex query modules.",
    projects: ["Student Management System", "SmartCampus AI"],
    experience: "Core relational query development."
  },
  // Backend
  {
    name: "Flask",
    category: "BACKEND",
    level: "WORKING KNOWLEDGE",
    description: "Lightweight Python web routing framework.",
    role: "Creating mock server systems and micro-APIs for local projects.",
    projects: [],
    experience: "Learned during Backend Development origins phase."
  },
  {
    name: "REST APIs",
    category: "BACKEND",
    level: "WORKING KNOWLEDGE",
    description: "Standard HTTP request routing and payload interfaces.",
    role: "Designing endpoints, validating client requests, and parsing data models.",
    projects: ["SmartCampus AI", "Full-Stack Portfolio"],
    experience: "Standard interface protocol for MERN and Flask systems."
  },
  // AI / Advanced Systems
  {
    name: "AI",
    category: "AI & SYSTEMS",
    level: "CURRENTLY EXPLORING",
    description: "Advanced machine learning, LLM prompts, and computer vision models.",
    role: "Image gesture tracking (MediaPipe) and generative assistant bots.",
    projects: ["SmartCampus AI", "Smart AI Robot", "Gesture Control Car"],
    experience: "Core focus area in B.Tech engineering studies."
  },
  {
    name: "AI Agents",
    category: "AI & SYSTEMS",
    level: "CURRENTLY EXPLORING",
    description: "Autonomous code loops executing specific toolsets.",
    role: "LLM reasoning loop integrations and automated workflow planning.",
    projects: ["Smart AI Robot"],
    experience: "Exploring agent loop structures and framework behaviors."
  },
  {
    name: "Multi-Agent Architecture",
    category: "AI & SYSTEMS",
    level: "CURRENTLY EXPLORING",
    description: "Cooperative systems with distributed task delegation.",
    role: "Building collaborative agent networks for complex operations.",
    projects: ["SmartCampus AI"],
    experience: "Studying routing and task-handshake architectures."
  },
  {
    name: "RAG Pipelines",
    category: "AI & SYSTEMS",
    level: "CURRENTLY EXPLORING",
    description: "Retrieval Augmented Generation models accessing private data stores.",
    role: "Optimizing embeddings search and contextual text generation.",
    projects: ["SmartCampus AI"],
    experience: "Connecting local information databases with cloud models."
  },
  // Frontend / Full Stack
  {
    name: "React",
    category: "FRONTEND / FULL STACK",
    level: "WORKING KNOWLEDGE",
    description: "Dynamic component-based client user interface rendering.",
    role: "Building responsive single page tactical interfaces and status dashboards.",
    projects: ["SmartCampus AI", "Full-Stack Portfolio"],
    experience: "Core frontend design stack."
  },
  {
    name: "JavaScript",
    category: "FRONTEND / FULL STACK",
    level: "WORKING KNOWLEDGE",
    description: "Interactive client and server logic scripting.",
    role: "Manipulating DOM states, handling API requests, and coding Node processes.",
    projects: ["SmartCampus AI", "Full-Stack Portfolio"],
    experience: "Used extensively for all web interfaces."
  },
  // Database
  {
    name: "MongoDB",
    category: "DATABASE",
    level: "WORKING KNOWLEDGE",
    description: "Flexible, non-relational document database.",
    role: "Schema model binding, indices organization, and records querying.",
    projects: ["SmartCampus AI", "Full-Stack Portfolio"],
    experience: "Core database layer in MERN projects."
  },
  // Systems / Engineering
  {
    name: "Digital Logic Design",
    category: "HARDWARE & SYSTEMS",
    level: "CURRENTLY EXPLORING",
    description: "Discrete combinational and sequential circuit design concepts.",
    role: "Hardware architectural layout planning and logic optimization.",
    projects: ["FPGA / Digital Logic Design"],
    experience: "ECE - VLSI academic focus areas."
  },
  {
    name: "Verilog",
    category: "HARDWARE & SYSTEMS",
    level: "CURRENTLY EXPLORING",
    description: "Hardware Description Language (HDL) for coding silicon structures.",
    role: "Implementing RTL design descriptions and testbench verification.",
    projects: ["Verilog hardware systems", "FPGA / Digital Logic Design"],
    experience: "VLSI course lab design practices."
  },
  {
    name: "FPGA",
    category: "HARDWARE & SYSTEMS",
    level: "CURRENTLY EXPLORING",
    description: "Field Programmable Gate Array silicon logic validation boards.",
    role: "Synthesizing RTL code and programming targets physically.",
    projects: ["Verilog hardware systems", "FPGA / Digital Logic Design"],
    experience: "Testing digital cores on physical boards."
  },
  // Development
  {
    name: "Git",
    category: "DEVELOPMENT",
    level: "WORKING KNOWLEDGE",
    description: "Distributed version control system.",
    role: "Staging modifications, committing milestones, and managing codebase histories.",
    projects: ["Full-Stack Portfolio", "SmartCampus AI"],
    experience: "Utilized across all software codebases."
  }
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
    status: "COMPLETED",
    tier: "experimental",
    purpose: "Store and manage academic operations, student profiles, and database records.",
    problemSolved: "Eliminated manual record handling by centralizing student details in a relational model.",
    architectureType: "python-script",
    features: ["CRUD operations on student records", "SQL query builder", "Data export"],
    security: ["Input sanitization", "Parametrized SQL queries"]
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
    status: "IN DEVELOPMENT",
    tier: "flagship",
    purpose: "Provide a unified smart campus AI assistant to help students navigate college services.",
    problemSolved: "Bridged the connectivity gap between distinct campus services using LLM reasoning.",
    architectureType: "MERN",
    features: ["AI campus chatbot", "Multi-agent task planner", "Service status monitor"],
    security: ["JWT auth", "Rate limits on AI endpoints", "Strict sanitization"]
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
    status: "COMPLETED",
    tier: "experimental",
    purpose: "Perform predictive and historical statistics analytics on match data.",
    problemSolved: "Streamlined raw match logs analysis using pandas and matplotlib.",
    architectureType: "python-script",
    features: ["Score progression charts", "Player performance metrics", "Run-rate charts"],
    security: ["Local sandbox execution"]
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
    status: "COMPLETED",
    tier: "secondary",
    purpose: "Control a physical vehicle model using hand gestures parsed via computer vision.",
    problemSolved: "Replaced standard remote joysticks with low-latency media-pipe gesture tracking.",
    architectureType: "hardware-sensor",
    features: ["Real-time hand gesture parsing", "Microcontroller serial link", "Collision warning triggers"],
    security: ["Local serial command bounds validation"]
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
    status: "IN DEVELOPMENT",
    tier: "experimental",
    purpose: "Optimize and track logistics for parcel routing inside campus.",
    problemSolved: "Reduced delivery delays by implementing pathfinding algorithms for campus pathways.",
    architectureType: "python-script",
    features: ["Shortest-path generation", "Delivery status log", "Interactive node map"],
    security: ["Sanitized route points input"]
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
    status: "IN DEVELOPMENT",
    tier: "secondary",
    purpose: "An autonomous robot platform integrated with local vision and reasoning loops.",
    problemSolved: "Combines real-world sensor input with a local language model agent.",
    architectureType: "hardware-sensor",
    features: ["Autonomous obstacle avoidance", "Vision target tracking", "Speech command parsing"],
    security: ["Hardware emergency stop control", "Encrypted motor command packets"]
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
    status: "COMPLETED",
    tier: "experimental",
    purpose: "Design and verify digital circuitry architectures on physical silicon.",
    problemSolved: "Implemented discrete digital building blocks (adders, multiplexers) directly on hardware.",
    architectureType: "FPGA-verilog",
    features: ["Combinatorial logic modules", "Sequential state machines", "Physical board verification"],
    security: ["Hardware constraint bounds checking"]
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
    status: "COMPLETED",
    tier: "experimental",
    purpose: "Develop processor components and custom logic systems in HDL.",
    problemSolved: "Model complex hardware systems with timing constraints in Verilog.",
    architectureType: "FPGA-verilog",
    features: ["ALU module design", "Register file design", "Logic synthesis validation"],
    security: ["Simulation bounds assert checks"]
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
    status: "COMPLETED",
    tier: "secondary",
    purpose: "Construct a dark tactical HUD engineering dashboard to showcase projects, skills, and learning journey.",
    problemSolved: "Built a modern MERN stack application with strict security controls and optimized 3D graphics.",
    architectureType: "MERN",
    features: ["3D cursor tracking robot avatar", "Tactical weapon rack skills armory", "Validated contact pipeline", "Dynamic project inspection dossiers"],
    security: ["Helmet headers", "CORS source locks", "Express rate limit controls", "Admin authorization checks"]
  }
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully.");

    const isReset = process.env.DB_RESET === "true";

    if (isReset) {
      console.log("WARNING: DB_RESET=true environment flag set. Performing destructive reset...");

      console.log("Wiping Journey...");
      await Journey.deleteMany({});
      const createdJourney = await Journey.insertMany(realJourney);
      console.log(`Seeded ${createdJourney.length} Journey phases.`);

      console.log("Wiping Skills...");
      await Skill.deleteMany({});
      const createdSkills = await Skill.insertMany(realSkills);
      console.log(`Seeded ${createdSkills.length} Skills.`);

      console.log("Wiping Certifications...");
      await Certification.deleteMany({});
      console.log("Certifications collection cleared.");

      console.log("Wiping Profile...");
      await Profile.deleteMany({});
      const profileDoc = await Profile.create(realProfile);
      console.log(`Seeded global profile document for: ${profileDoc.name}`);

      console.log("Wiping Projects...");
      await Project.deleteMany({});
      const createdProjects = await Project.insertMany(realProjects);
      console.log(`Seeded ${createdProjects.length} Projects.`);
    } else {
      console.log("Safe seeding mode. Performing idempotent upserts...");

      // 1. Safe Journey Upserts
      for (const item of realJourney) {
        await Journey.findOneAndUpdate({ phase: item.phase }, item, { upsert: true, new: true });
      }
      console.log("Journey upsert completed.");

      // 2. Safe Skills Upserts
      for (const item of realSkills) {
        await Skill.findOneAndUpdate({ name: item.name }, item, { upsert: true, new: true });
      }
      console.log("Skills upsert completed.");

      // 3. Safe Profile Upsert (always update the single document)
      const existingProfile = await Profile.findOne();
      if (existingProfile) {
        await Profile.findByIdAndUpdate(existingProfile._id, realProfile, { new: true });
      } else {
        await Profile.create(realProfile);
      }
      console.log("Profile upsert completed.");

      // 4. Safe Projects Upserts
      for (const item of realProjects) {
        await Project.findOneAndUpdate({ title: item.title }, item, { upsert: true, new: true });
      }
      console.log("Projects upsert completed.");
    }

    console.log("Database operation completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

seed();
