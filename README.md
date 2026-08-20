# 3D/HUD Cyber Portfolio

A futuristic, highly polished 3D HUD developer portfolio built using React, Three.js, Framer Motion, Express, and MongoDB.

---

## 📂 Project Structure

```text
├── portfolio-backend/       # Express server & MongoDB schema logic
└── portfolio-frontend/      # React single page application & 3D models
```

---

## 🛠️ Local Installation & Setup

Follow these steps to configure and boot up the full-stack system locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB database server)

### 2. Configure Backend Environment
Navigate to the `portfolio-backend` folder, duplicate the environment template, and set up your connection strings:
```bash
cd portfolio-backend
cp .env.example .env
```
Open the newly created `.env` file and define the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-address>/portfolioDB?retryWrites=true&w=majority
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
