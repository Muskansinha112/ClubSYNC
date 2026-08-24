# ⚡ ClubSYNC — Campus Club & Domain Task Management System

![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20TailwindCSS-61DAFB.svg)
![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)

**ClubSYNC** is a full-stack campus club task management platform built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It enables club leaders, presidents, domain heads, and managers to seamlessly assign, track, filter, and monitor tasks across club departments and member designations.

---

## ✨ Key Features

- 📊 **Executive Dashboard & Live Counters:** Instant stats for **Total Tasks**, **Pending**, **Completed**, and **Overdue** tasks. Clicking any counter filters the list automatically.
- 🏷️ **Club Domain Department Tags:** Categorize and filter tasks across 7 club domains:
  - 💻 **Technical**
  - 🎨 **Design**
  - ⚙️ **Operations**
  - 📦 **Logistics**
  - 💰 **Sponsorship**
  - 📢 **Marketing / PR**
  - 📁 **General**
- 👤 **Designation Role Tracking:** Assign tasks specifically tailored for **Domain Heads**, **Coordinators**, **Managers**, and **Executives**.
- ✍️ **Explicit Assignee & Assigner Metadata:** Clear visibility on **Task Assigned To** `(Name + Designation)` and **Task Assigned By** `(Name + Designation)`.
- 📅 **Smart Relative Deadlines:** Automatically calculates remaining or past days (*Due Today*, *Due in 4 days*, *Overdue by 2 days*).
- 🔍 **Real-time Search Bar:** Instantly search tasks by title, assigned person, creator, or department domain.
- 🎨 **Modern Modal UI:** Backdrop-blurred overlay modal forms for assigning new tasks and clean delete confirmation dialogs.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Hooks: `useState`, `useEffect`, `useMemo`), Tailwind CSS |
| **Backend** | Node.js, Express.js framework, CORS middleware, dotenv |
| **Database** | MongoDB, Mongoose ODM |
| **Tooling** | npm, Git, GitHub |

---

## 🔌 REST API Endpoints

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch all tasks from MongoDB |
| `POST` | `/api/tasks` | Create and assign a new task |
| `PUT` | `/api/tasks/:id` | Update task status (Pending / Completed) |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID |

---

## 📁 Project Structure

```text
ClubSYNC/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose Schema for Task, Domain, and Roles
│   ├── routes/
│   │   └── taskRoutes.js    # Express REST API Routes (GET, POST, PUT, DELETE)
│   ├── .env                 # Database URI & Environment Configuration
│   ├── package.json         # Backend Dependencies
│   └── server.js            # Node.js Express Server Setup (Port 5001)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js           # Main React Dashboard & Modal UI
│   │   ├── index.js         # React App Entry Point
│   │   └── index.css        # Tailwind CSS Directives
│   ├── package.json         # Frontend Dependencies
│   └── tailwind.config.js   # Tailwind Configuration
└── README.md                # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally on `mongodb://127.0.0.1:27017/clubsync`)

### 1. Clone the Repository
```bash
git clone https://github.com/Muskansinha112/ClubSYNC.git
cd ClubSYNC
```

### 2. Set Up & Start Backend
```bash
cd backend
npm install
node server.js
```
*Backend will run on **`http://localhost:5001`***

### 3. Set Up & Start Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm start
```
*Frontend will launch automatically at **`http://localhost:3000`***

---

## 👤 Author

* **Muskan Sinha** — [GitHub](https://github.com/Muskansinha112)

---
*Created with ❤️ for Campus Clubs & Student Organizations.*
