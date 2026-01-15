# 🚀 SkillPocket – Complete Project Guide

SkillPocket is a collaborative skill‑sharing and learning platform designed to connect learners, mentors, and skill providers in one place. This document serves as a **complete README guide**, covering **project overview, tech stack, folder structure, frontend & backend architecture, styling conventions, setup commands, workflows, and contribution guidelines**.

---

## 📌 Project Overview

**SkillPocket** is built to:

* Allow users to explore and learn new skills
* Connect mentors and learners
* Provide structured skill content
* Enable authentication, profiles, and skill management

This project follows **modern full‑stack development practices** with clean architecture, scalability, and collaboration in mind.

---

## 🧠 Tech Stack

### Frontend

* **React.js**
* **Vite** (fast development server)
* **Tailwind CSS** (utility‑first styling)
* **Axios / Fetch API**
* **React Router**
* **Context API / Redux (if used)**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB** (Mongoose ODM)
* **JWT Authentication**
* **bcrypt** (password hashing)
* **dotenv** (environment variables)

### Tools & DevOps

* **Git & GitHub** (version control)
* **VS Code** (development)
* **Postman** (API testing)
* **ESLint & Prettier**

---

## 📂 Folder Structure (Root)

```
SkillPocket/
│
├── frontend/        # React client
├── backend/         # Node + Express server
├── README.md
├── .gitignore
└── package.json     # (if root scripts exist)
```

---

## 🎨 Frontend Folder Structure

```
frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── assets/          # Images, icons, fonts
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Loader.jsx
│   │
│   ├── pages/           # Route‑based pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   └── Skills.jsx
│   │
│   ├── routes/          # Route definitions
│   ├── context/         # Global state (auth, user)
│   ├── services/        # API calls
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Helper functions
│   ├── App.jsx
│   └── main.jsx
│
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🎨 Styling Guidelines (Frontend)

* **Tailwind CSS only** (avoid inline styles)
* Colors defined in `tailwind.config.js`
* Use consistent spacing: `p-4`, `m-6`
* Responsive design using:

  * `sm:` `md:` `lg:` `xl:`
* Components should be **small & reusable**

Example:

```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Learn Skill
</button>
```

---

## 🧩 Backend Folder Structure

```
backend/
├── src/
│   ├── config/          # DB & app config
│   │   └── db.js
│   │
│   ├── controllers/     # Request logic
│   │   ├── auth.controller.js
│   │   └── skill.controller.js
│   │
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   └── Skill.js
│   │
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   └── skill.routes.js
│   │
│   ├── middleware/      # Auth & error handlers
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── services/        # Business logic
│   ├── utils/           # Helpers
│   └── app.js
│
├── server.js
├── .env
└── package.json
```

---

## 🔐 Authentication Flow

1. User registers → password hashed
2. JWT token generated on login
3. Token stored in client (localStorage/cookie)
4. Protected routes use middleware

---

## ⚙️ Environment Variables

### Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Setup & Run Commands

### Clone Repo

```
git clone <repo-url>
cd SkillPocket
```

### Frontend

```
cd frontend
npm install
npm run dev
```

### Backend

```
cd backend
npm install
npm start
```

---

## 🔄 Git Collaboration Workflow

1. Create branch

```
git checkout -b feature/your-feature
```

2. Commit

```
git add .
git commit -m "Add feature"
```

3. Push

```
git push origin feature/your-feature
```

4. Open Pull Request

---

## 🧪 Testing

* Backend: Postman / Thunder Client
* Frontend: Manual UI testing

---

## 📏 Coding Standards

* Meaningful variable names
* One responsibility per component
* No hard‑coded secrets
* Use async/await

---

## 🤝 Contribution Guidelines

* Follow folder structure
* Write clean commits
* Test before PR
* Respect existing styles

---

## 📄 License

This project is open‑source and intended for learning and collaboration.

---

## ✨ Author

**SkillPocket Team**
Built with ❤️ for collaborative learning
