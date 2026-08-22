# 3D/HUD Cyber Portfolio

A futuristic, highly polished 3D HUD developer portfolio built using React, Three.js, Framer Motion, Express, and MongoDB.

---

## 📂 Project Structure

```text
├── portfolio-backend/       # Express server & MongoDB schema logic
└── portfolio-frontend/      # React single page application & 3D models
```

---

## 🚀 Advanced Cybernetic Features

The system has been hardened and enhanced with several critical full-stack modules:

### 1. 🤖 3D Sci-Fi Robot Assistant (`Three.js`)
* **Cybernetic Remodel**: Remodeled with low-poly segmented torso plates, mechanical shoulder joints, stepped dual antenna arrays, and a dual-segment tactical scanning visor.
* **Ambient Floating Halo**: Features a thin wireframe halo revolving behind the robot head.
* **Reactor Core Ring**: Incorporates a rotating glowing torus revolving around the pulsing core.
* **Projection Grid & Particles**: Anchored by a baseline projection grid helper and surrounded by slowly drifting light spark particles.
* **Garbage Collection**: Comprehensive memory cleanup (disposes of geometries, materials, and loops on unmount) preventing page lag and memory leaks.

### 2. 📁 MongoDB GridFS Profile Image Module
* **Binary Image Storage**: Profile pictures are saved as binary chunks inside MongoDB Atlas using GridFS buckets rather than storing fragile URLs.
* **On-Demand Streaming**: The controller streams binary data with proper content-type directly from GridFS via `GET /api/profile/image`.
* **Hardened Admin Uploads**: Includes an admin-protected `POST /api/profile/image` endpoint supporting multi-part form data uploads limited to `2MB` for JPEG, PNG, and WEBP formats.

### 3. 📧 Secure Contact Transmission & SMTP Delivery
* **Real Email Delivery**: Routes visitor messages directly to your professional email via Nodemailer SMTP.
* **MongoDB Persistence**: Retains all historical messages securely in a MongoDB collection.
* **Payload Verification**: Employs strict request limits (`10kb` body caps) and validation filters to block injection attempts.
* **Partial Mode Fallback**: Displays a tactical `TRANSMISSION_PARTIAL` banner in the UI if SMTP connections are offline while guaranteeing the message is safely stored in the database.
* **Rate Limiting**: Throttles API endpoints to protect database clusters against automated spam.

### 4. 🗂️ Flagship Bento Grid & Telemetry Dossier
* **Project Tiers**: Classifies projects dynamically into Flagship, Secondary, and Experimental folders.
* **Flow Visualization**: Visualizes structural architecture flows (e.g., MERN stacks, Python CLI pipelines, VLSI hardware flows) using Lucide symbols.

---

## 🛠️ Local Installation & Setup

Follow these steps to configure and boot up the full-stack system locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB database server)

### 2. Configure Backend Environment
Navigate to the `portfolio-backend` folder, duplicate the environment template, and set up your variables:
```bash
cd portfolio-backend
cp .env.example .env
```
Open the newly created `.env` file and define the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-address>/portfolioDB?retryWrites=true&w=majority

# Administrative Security
ADMIN_API_KEY=your_super_secure_key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Install Dependencies & Seed Database
From the project directories, run the package installations and seed the database with mock schema documents:

#### Backend:
```bash
cd portfolio-backend
npm install
node seed.js     # Seeds initial operational milestones, skills, and projects
```

#### Frontend:
```bash
cd portfolio-frontend
npm install
```

### 4. Start the Application

To run the full-stack application concurrently:

#### Start Backend Server (Port 5000):
```bash
cd portfolio-backend
npm run dev      # Boots server via nodemon for hot-reload
```

#### Start Frontend Client (Port 5173):
```bash
cd portfolio-frontend
npm run dev      # Boots local Vite client development server
```

Open [http://localhost:5173](http://localhost:5173) in your browser to inspect the application.

---

## 🧪 Testing & Production Bundles

Inside the `portfolio-frontend` directory, you can run quality checks and build packages:

* **Lint Codebase**: `npm run lint` (runs Oxlint diagnostic checks)
* **Production Build**: `npm run build` (compiles and bundles assets into `dist/` directory)
