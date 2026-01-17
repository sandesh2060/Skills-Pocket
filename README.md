# 🚀 skillspocket – Premium Freelancing Marketplace

## Folder structure :

Skillpocket/
├── frontend/
│ ├── user/
│ │ ├── public/
│ │ │ ├── index.html
│ │ │ ├── favicon.ico
│ │ │ └── assets/
│ │ │ └── images/
│ │ ├── src/
│ │ │ ├── api/
│ │ │ │ ├── axios.js
│ │ │ │ ├── authApi.js
│ │ │ │ ├── jobApi.js
│ │ │ │ ├── profileApi.js
│ │ │ │ └── messageApi.js
│ │ │ ├── components/
│ │ │ │ ├── common/
│ │ │ │ │ ├── Header.jsx
│ │ │ │ │ ├── Footer.jsx
│ │ │ │ │ ├── Button.jsx
│ │ │ │ │ ├── Input.jsx
│ │ │ │ │ ├── Modal.jsx
│ │ │ │ │ ├── Skeleton.jsx
│ │ │ │ │ ├── Loader.jsx
│ │ │ │ │ └── ProtectedRoute.jsx
│ │ │ │ ├── auth/
│ │ │ │ │ ├── LoginForm.jsx
│ │ │ │ │ ├── SignupForm.jsx
│ │ │ │ │ ├── SocialLogin.jsx
│ │ │ │ │ └── RoleToggle.jsx
│ │ │ │ ├── home/
│ │ │ │ │ ├── HeroSection.jsx
│ │ │ │ │ ├── ServicesSection.jsx
│ │ │ │ │ ├── FeaturedFreelancers.jsx
│ │ │ │ │ ├── HowItWorks.jsx
│ │ │ │ │ ├── StatsSection.jsx
│ │ │ │ │ └── TestimonialSection.jsx
│ │ │ │ ├── dashboard/
│ │ │ │ │ ├── freelancer/
│ │ │ │ │ │ ├── DashboardStats.jsx
│ │ │ │ │ │ ├── ActiveProposals.jsx
│ │ │ │ │ │ ├── EarningsChart.jsx
│ │ │ │ │ │ └── ProfileCompletion.jsx
│ │ │ │ │ └── client/
│ │ │ │ │ ├── ClientStats.jsx
│ │ │ │ │ ├── ActiveProjects.jsx
│ │ │ │ │ ├── ProjectTimeline.jsx
│ │ │ │ │ └── NewProposals.jsx
│ │ │ │ ├── jobs/
│ │ │ │ │ ├── JobCard.jsx
│ │ │ │ │ ├── JobFilters.jsx
│ │ │ │ │ ├── JobSearch.jsx
│ │ │ │ │ └── JobDetails.jsx
│ │ │ │ ├── profile/
│ │ │ │ │ ├── ProfileHeader.jsx
│ │ │ │ │ ├── SkillsSection.jsx
│ │ │ │ │ ├── PortfolioGallery.jsx
│ │ │ │ │ └── ReviewsList.jsx
│ │ │ │ ├── messaging/
│ │ │ │ │ ├── ConversationList.jsx
│ │ │ │ │ ├── MessageThread.jsx
│ │ │ │ │ ├── MessageInput.jsx
│ │ │ │ │ └── FileAttachment.jsx
│ │ │ │ └── wallet/
│ │ │ │ ├── WalletStats.jsx
│ │ │ │ ├── TransactionTable.jsx
│ │ │ │ └── WithdrawModal.jsx
│ │ │ ├── pages/
│ │ │ │ ├── Home.jsx
│ │ │ │ ├── Login.jsx
│ │ │ │ ├── Signup.jsx
│ │ │ │ ├── FreelancerDashboard.jsx
│ │ │ │ ├── ClientDashboard.jsx
│ │ │ │ ├── JobSearch.jsx
│ │ │ │ ├── JobDetails.jsx
│ │ │ │ ├── Profile.jsx
│ │ │ │ ├── Messages.jsx
│ │ │ │ ├── Wallet.jsx
│ │ │ │ ├── Settings.jsx
│ │ │ │ └── NotFound.jsx
│ │ │ ├── hooks/
│ │ │ │ ├── useAuth.js
│ │ │ │ ├── useJobs.js
│ │ │ │ ├── useProfile.js
│ │ │ │ ├── useMessages.js
│ │ │ │ ├── useWallet.js
│ │ │ │ └── useDebounce.js
│ │ │ ├── context/
│ │ │ │ ├── AuthContext.jsx
│ │ │ │ ├── ThemeContext.jsx
│ │ │ │ └── NotificationContext.jsx
│ │ │ ├── utils/
│ │ │ │ ├── helpers.js
│ │ │ │ ├── validators.js
│ │ │ │ ├── constants.js
│ │ │ │ └── formatters.js
│ │ │ ├── styles/
│ │ │ │ ├── index.css
│ │ │ │ └── animations.css
│ │ │ ├── assets/
│ │ │ │ ├── images/
│ │ │ │ ├── icons/
│ │ │ │ └── fonts/
│ │ │ ├── App.jsx
│ │ │ ├── main.jsx
│ │ │ └── routes.jsx
│ │ ├── .env
│ │ ├── .env.example
│ │ ├── package.json
│ │ ├── tailwind.config.js
│ │ ├── postcss.config.js
│ │ ├── vite.config.js
│ │ └── .gitignore
│ │
│ └── admin/
│ ├── public/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ │ ├── common/
│ │ │ ├── dashboard/
│ │ │ ├── users/
│ │ │ ├── jobs/
│ │ │ ├── disputes/
│ │ │ └── analytics/
│ │ ├── pages/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── UserManagement.jsx
│ │ │ ├── JobManagement.jsx
│ │ │ ├── DisputeResolution.jsx
│ │ │ ├── FinancialMonitoring.jsx
│ │ │ └── Settings.jsx
│ │ ├── hooks/
│ │ ├── context/
│ │ ├── utils/
│ │ ├── styles/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
├── backend/
│ ├── user/
│ │ ├── src/
│ │ │ ├── config/
│ │ │ │ ├── database.js
│ │ │ │ ├── cloudinary.js
│ │ │ │ ├── redis.js
│ │ │ │ └── env.js
│ │ │ ├── models/
│ │ │ │ ├── User.js
│ │ │ │ ├── Job.js
│ │ │ │ ├── Proposal.js
│ │ │ │ ├── Message.js
│ │ │ │ ├── Transaction.js
│ │ │ │ ├── Review.js
│ │ │ │ └── Notification.js
│ │ │ ├── controllers/
│ │ │ │ ├── authController.js
│ │ │ │ ├── userController.js
│ │ │ │ ├── jobController.js
│ │ │ │ ├── proposalController.js
│ │ │ │ ├── messageController.js
│ │ │ │ ├── transactionController.js
│ │ │ │ └── reviewController.js
│ │ │ ├── routes/
│ │ │ │ ├── authRoutes.js
│ │ │ │ ├── userRoutes.js
│ │ │ │ ├── jobRoutes.js
│ │ │ │ ├── proposalRoutes.js
│ │ │ │ ├── messageRoutes.js
│ │ │ │ ├── transactionRoutes.js
│ │ │ │ └── reviewRoutes.js
│ │ │ ├── middlewares/
│ │ │ │ ├── authMiddleware.js
│ │ │ │ ├── errorHandler.js
│ │ │ │ ├── validator.js
│ │ │ │ ├── upload.js
│ │ │ │ └── rateLimiter.js
│ │ │ ├── services/
│ │ │ │ ├── emailService.js
│ │ │ │ ├── paymentService.js
│ │ │ │ ├── notificationService.js
│ │ │ │ └── socketService.js
│ │ │ ├── utils/
│ │ │ │ ├── helpers.js
│ │ │ │ ├── validators.js
│ │ │ │ ├── constants.js
│ │ │ │ └── logger.js
│ │ │ ├── socket/
│ │ │ │ ├── index.js
│ │ │ │ ├── messageHandler.js
│ │ │ │ └── notificationHandler.js
│ │ │ ├── app.js
│ │ │ └── server.js
│ │ ├── uploads/
│ │ ├── logs/
│ │ ├── .env
│ │ ├── .env.example
│ │ ├── package.json
│ │ └── .gitignore
│ │
│ └── admin/
│ ├── src/
│ │ ├── config/
│ │ ├── models/
│ │ │ └── Admin.js
│ │ ├── controllers/
│ │ │ ├── adminAuthController.js
│ │ │ ├── userManagementController.js
│ │ │ ├── jobManagementController.js
│ │ │ ├── disputeController.js
│ │ │ └── analyticsController.js
│ │ ├── routes/
│ │ │ ├── adminAuthRoutes.js
│ │ │ ├── userManagementRoutes.js
│ │ │ ├── jobManagementRoutes.js
│ │ │ ├── disputeRoutes.js
│ │ │ └── analyticsRoutes.js
│ │ ├── middlewares/
│ │ │ └── adminAuth.js
│ │ ├── services/
│ │ ├── utils/
│ │ ├── app.js
│ │ └── server.js
│ ├── .env
│ ├── package.json
│ └── .gitignore
│
├── shared/
│ ├── constants/
│ │ ├── roles.js
│ │ ├── status.js
│ │ └── errors.js
│ └── types/
│
├── .gitignore
├── README.md
└── docker-compose.yml

## added this in a project files
frontend/user/src/components/dashboard/
├── freelancer/
│   ├── FreelancerSidebar.jsx (from previous artifact)
│   └── FreelancerNavbar.jsx (from previous artifact)
└── client/
    ├── ClientSidebar.jsx (this file above)
    └── ClientNavbar.jsx (this file above)


frontend/user/src/
├── pages/
│   ├── Login.jsx ✅
│   ├── Signup.jsx ✅
│   ├── FreelancerDashboard.jsx ✅
│   ├── FreelancerJobs.jsx ✅ NEW
│   ├── FreelancerMessages.jsx ✅ NEW
│   ├── FreelancerWallet.jsx ✅ NEW
│   ├── FreelancerProfile.jsx ✅ NEW
│   ├── ClientDashboard.jsx ✅
│   ├── ClientJobs.jsx ✅ NEW
│   ├── ClientHire.jsx ✅ NEW
│   ├── ClientInbox.jsx ✅ NEW
│   ├── ClientFinances.jsx ✅ NEW
│   ├── ClientHelp.jsx ✅ NEW
│   └── ClientSettings.jsx ✅ NEW
├── components/
│   ├── dashboard/
│   │   ├── freelancer/ ✅
│   │   └── client/ ✅
│   └── common/ ✅
├── context/
│   └── AuthContext.jsx ✅
├── utils/
│   └── authUtils.js ✅
└── App.jsx ✅ UPDATED

<div align="center">
  <img src="https://your-logo-url.com/logo.png" alt="skillspocket Logo" width="120" />
  <h2>A modern, premium freelancing marketplace connecting top talent with global clients</h2>
  <a href="#live-demo">Live Demo</a> • <a href="#documentation">Documentation</a> • <a href="#contributing">Contribute</a> • <a href="#support">Support</a>
</div>

---

<div align="center">
  <img src="https://your-logo-url.com/logo.png" alt="skillspocket Logo" width="120" />
  <h2>A modern, premium freelancing marketplace connecting top talent with global clients</h2>
  <a href="#live-demo">Live Demo</a> • <a href="#documentation">Documentation</a> • <a href="#contributing">Contribute</a> • <a href="#support">Support</a>
</div>

---

## 📌 Overview

**skillspocket** is a full-stack freelancing marketplace inspired by platforms like Upwork, Fiverr, and Freelancer. It features a premium UI, modern animations, and scalable architecture.

Clients can post projects, hire freelancers, manage milestones, and make secure payments. Freelancers can build professional profiles, submit proposals, communicate in real time, and track earnings.

---

## ✨ What Makes skillspocket Different?

- **Premium, clean & modern UI**
- **Skeleton loaders** for seamless loading experience
- **GSAP-powered micro-interactions & animations**
- **Secure escrow & milestone payments**
- **Real-time chat with file sharing**
- **Role-based dashboards** (Client / Freelancer / Admin)
- **Fully responsive & mobile-first design**

---

## ✨ Core Features

### 🔐 Authentication & Security

- Role-based signup (Client / Freelancer)
- JWT authentication & protected routes
- Email & OTP verification
- Social login (Google, LinkedIn)
- Password reset & account recovery

### 👨‍💼 Client Features

- Post & manage projects
- Review proposals & hire freelancers
- Milestone-based escrow payments
- Track project progress
- Rate & review freelancers

### 👩‍💻 Freelancer Features

- Professional profile & portfolio
- Skill & expertise management
- Browse jobs & submit proposals
- Real-time earnings dashboard
- Secure withdrawals & payment history

### 💬 Messaging System

- Real-time chat (Socket.io)
- File & media sharing
- Emoji support
- Message notifications

### 💳 Payment System

- Stripe integration
- Escrow & milestone payments
- Wallet & transaction history
- Invoice generation
- Multi-currency ready

### 🛡️ Admin Panel

- User & project management
- Payment monitoring
- Dispute resolution
- Analytics & platform insights

### 🎨 UI / UX & Animations

- Tailwind CSS (utility-first, scalable styling)
- Soft shadows & rounded cards
- Clean typography & consistent spacing

- Light & Dark mode support

Animations & Loaders

GSAP for smooth page transitions & micro-interactions

Skeleton loaders for:

Page loading

Cards & lists

Dashboards & tables

Accessible motion (no excessive animation)

---

## 🛠️ Tech Stack

**Frontend:**

- React 18
- Vite
- Tailwind CSS
- GSAP (animations)
- React Router v6
- Axios
- Socket.io Client
- React Hot Toast

**Backend:**

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Socket.io
- Stripe Payments
- Cloudinary (media)
- Nodemailer (emails)
- Redis (optional caching)

---

## 📁 Project Structure

```text
skillspocket/
│
├── frontend/
│   ├── user/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── context/
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   ├── assets/
│   │   │   ├── styles/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   └── tailwind.config.js
│   └── admin/
│       └── (Admin UI structure)
│
├── backend/
│   ├── user/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── server.js
│   └── admin/
│       └── (Admin API structure)
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/skillspocket.git
cd skillspocket

# Backend
cd backend/user
npm install
npm run dev

# Frontend
cd ../../frontend/user
npm install
npm run dev
```

---

## 🔐 Authentication Flow

1. User signs up → selects role
2. Email / OTP verification
3. JWT issued on login
4. Role-based dashboard access
5. Protected routes enforced

---

## 🔐 API testing with insomnia

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.skillspocket.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📍 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "freelancer",
  "phone": "+1234567890"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "freelancer",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "freelancer",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Verify Email

**POST** `/auth/verify-email`

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### 4. Forgot Password

**POST** `/auth/forgot-password`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

### 5. Reset Password

**POST** `/auth/reset-password`

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

### 6. Logout

**POST** `/auth/logout`
**Headers:** `Authorization: Bearer <token>`

---

## 👤 User Endpoints

### 1. Get Current User Profile

**GET** `/users/me`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "freelancer",
    "profilePicture": "https://cloudinary.com/...",
    "bio": "Full-stack developer with 5 years experience",
    "skills": ["React", "Node.js", "MongoDB"],
    "hourlyRate": 50,
    "location": "New York, USA",
    "portfolio": [],
    "rating": 4.8,
    "totalEarnings": 15000,
    "completedJobs": 45
  }
}
```

### 2. Update Profile

**PUT** `/users/me`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "bio": "Experienced full-stack developer",
  "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
  "hourlyRate": 60,
  "location": "San Francisco, USA"
}
```

### 3. Upload Profile Picture

**POST** `/users/upload-profile-picture`
**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `profilePicture`: File

### 4. Get User by ID

**GET** `/users/:userId`

### 5. Update Password

**PUT** `/users/me/password`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

---

## 💼 Job Endpoints

### 1. Create Job (Client Only)

**POST** `/jobs`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "Build a React Dashboard",
  "description": "Need a modern, responsive dashboard with charts and analytics",
  "category": "Web Development",
  "skills": ["React", "Tailwind CSS", "Chart.js"],
  "budget": {
    "min": 500,
    "max": 1000
  },
  "duration": "1-2 weeks",
  "experienceLevel": "intermediate",
  "projectType": "fixed"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Build a React Dashboard",
    "description": "Need a modern, responsive dashboard...",
    "client": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "category": "Web Development",
    "skills": ["React", "Tailwind CSS", "Chart.js"],
    "budget": {
      "min": 500,
      "max": 1000
    },
    "status": "open",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

### 2. Get All Jobs

**GET** `/jobs`
**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 10)
- `category` (optional)
- `skills` (optional, comma-separated)
- `budget_min` (optional)
- `budget_max` (optional)
- `experienceLevel` (optional)
- `search` (optional)

**Example:** `/jobs?page=1&limit=10&category=Web Development&skills=React,Node.js`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalJobs": 47,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 3. Get Job by ID

**GET** `/jobs/:jobId`

### 4. Update Job

**PUT** `/jobs/:jobId`
**Headers:** `Authorization: Bearer <token>`

### 5. Delete Job

**DELETE** `/jobs/:jobId`
**Headers:** `Authorization: Bearer <token>`

### 6. Get My Posted Jobs (Client)

**GET** `/jobs/my-jobs`
**Headers:** `Authorization: Bearer <token>`

---

## 📝 Proposal Endpoints

### 1. Submit Proposal (Freelancer Only)

**POST** `/proposals`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "jobId": "507f1f77bcf86cd799439012",
  "coverLetter": "I'm excited to work on this project...",
  "proposedBudget": 800,
  "estimatedDuration": "10 days",
  "milestones": [
    {
      "title": "Design & Setup",
      "amount": 200,
      "duration": "2 days"
    },
    {
      "title": "Development",
      "amount": 400,
      "duration": "5 days"
    },
    {
      "title": "Testing & Deployment",
      "amount": 200,
      "duration": "3 days"
    }
  ]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Proposal submitted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "job": "507f1f77bcf86cd799439012",
    "freelancer": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "rating": 4.8
    },
    "coverLetter": "I'm excited to work on this project...",
    "proposedBudget": 800,
    "status": "pending",
    "submittedAt": "2026-01-15T11:00:00Z"
  }
}
```

### 2. Get Proposals for Job (Client)

**GET** `/proposals/job/:jobId`
**Headers:** `Authorization: Bearer <token>`

### 3. Get My Proposals (Freelancer)

**GET** `/proposals/my-proposals`
**Headers:** `Authorization: Bearer <token>`

### 4. Accept Proposal (Client)

**PUT** `/proposals/:proposalId/accept`
**Headers:** `Authorization: Bearer <token>`

### 5. Reject Proposal (Client)

**PUT** `/proposals/:proposalId/reject`
**Headers:** `Authorization: Bearer <token>`

### 6. Withdraw Proposal (Freelancer)

**DELETE** `/proposals/:proposalId`
**Headers:** `Authorization: Bearer <token>`

---

## 💬 Message Endpoints

### 1. Get All Conversations

**GET** `/messages/conversations`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "participants": [
        {
          "id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "profilePicture": "https://..."
        },
        {
          "id": "507f1f77bcf86cd799439015",
          "name": "Jane Smith",
          "profilePicture": "https://..."
        }
      ],
      "lastMessage": {
        "text": "Sure, I'll send the files tomorrow",
        "timestamp": "2026-01-15T14:30:00Z"
      },
      "unreadCount": 2
    }
  ]
}
```

### 2. Get Messages in Conversation

**GET** `/messages/conversation/:conversationId`
**Headers:** `Authorization: Bearer <token>`
**Query:** `?page=1&limit=50`

### 3. Send Message

**POST** `/messages`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "recipientId": "507f1f77bcf86cd799439015",
  "text": "Hello! I'd like to discuss the project",
  "jobId": "507f1f77bcf86cd799439012"
}
```

### 4. Upload File Attachment

**POST** `/messages/upload`
**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `file`: File
- `recipientId`: String
- `conversationId`: String (optional)

### 5. Mark as Read

**PUT** `/messages/conversation/:conversationId/read`
**Headers:** `Authorization: Bearer <token>`

---

## 💳 Transaction Endpoints

### 1. Get Wallet Balance

**GET** `/transactions/wallet`
**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "balance": 2500.5,
    "pendingAmount": 800.0,
    "totalEarnings": 15000.0,
    "availableForWithdrawal": 1700.5
  }
}
```

### 2. Get Transaction History

**GET** `/transactions`
**Headers:** `Authorization: Bearer <token>`
**Query:** `?page=1&limit=20&type=credit&status=completed`

### 3. Create Payment Intent (Client)

**POST** `/transactions/payment-intent`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "jobId": "507f1f77bcf86cd799439012",
  "amount": 800,
  "milestoneId": "507f1f77bcf86cd799439016"
}
```

### 4. Release Payment (Client)

**POST** `/transactions/release`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "transactionId": "507f1f77bcf86cd799439017",
  "jobId": "507f1f77bcf86cd799439012"
}
```

### 5. Request Withdrawal (Freelancer)

**POST** `/transactions/withdraw`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "amount": 1000,
  "method": "bank_transfer",
  "accountDetails": {
    "accountNumber": "1234567890",
    "routingNumber": "123456789",
    "accountHolderName": "John Doe"
  }
}
```

### 6. Get Transaction by ID

**GET** `/transactions/:transactionId`
**Headers:** `Authorization: Bearer <token>`

---

## ⭐ Review Endpoints

### 1. Create Review

**POST** `/reviews`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "jobId": "507f1f77bcf86cd799439012",
  "revieweeId": "507f1f77bcf86cd799439015",
  "rating": 5,
  "comment": "Excellent work! Very professional and delivered on time.",
  "categories": {
    "communication": 5,
    "quality": 5,
    "professionalism": 5,
    "timeliness": 4
  }
}
```

## testing insomnia collection

````json {
  "_type": "export",
  "__export_format": 4,
  "__export_date": "2026-01-15T00:00:00.000Z",
  "__export_source": "insomnia.desktop.app:v2023.5.8",
  "resources": [
    {
      "_id": "wrk_skillspocket",
      "_type": "workspace",
      "name": "skillspocket API",
      "description": "Complete API collection for skillspocket freelancing marketplace"
    },
    {
      "_id": "env_base",
      "_type": "environment",
      "name": "Base Environment",
      "data": {
        "base_url": "http://localhost:5000/api",
        "auth_token": "",
        "admin_token": "",
        "user_id": "",
        "job_id": "",
        "proposal_id": "",
        "conversation_id": ""
      }
    },
    {
      "_id": "env_dev",
      "_type": "environment",
      "name": "Development",
      "data": {
        "base_url": "http://localhost:5000/api"
      }
    },
    {
      "_id": "env_prod",
      "_type": "environment",
      "name": "Production",
      "data": {
        "base_url": "https://api.skillspocket.com/api"
      }
    },
    {
      "_id": "fld_auth",
      "_type": "request_group",
      "name": "Authentication",
      "environment": {}
    },
    {
      "_id": "req_register",
      "_type": "request",
      "parentId": "fld_auth",
      "name": "Register User",
      "method": "POST",
      "url": "{{ base_url }}/auth/register",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"Password123!\",\n  \"role\": \"freelancer\",\n  \"phone\": \"+1234567890\"\n}"
      }
    },
    {
      "_id": "req_login",
      "_type": "request",
      "parentId": "fld_auth",
      "name": "Login",
      "method": "POST",
      "url": "{{ base_url }}/auth/login",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"Password123!\"\n}"
      }
    },
    {
      "_id": "req_verify_email",
      "_type": "request",
      "parentId": "fld_auth",
      "name": "Verify Email",
      "method": "POST",
      "url": "{{ base_url }}/auth/verify-email",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"john@example.com\",\n  \"otp\": \"123456\"\n}"
      }
    },
    {
      "_id": "req_forgot_password",
      "_type": "request",
      "parentId": "fld_auth",
      "name": "Forgot Password",
      "method": "POST",
      "url": "{{ base_url }}/auth/forgot-password",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"john@example.com\"\n}"
      }
    },
    {
      "_id": "req_reset_password",
      "_type": "request",
      "parentId": "fld_auth",
      "name": "Reset Password",
      "method": "POST",
      "url": "{{ base_url }}/auth/reset-password",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"john@example.com\",\n  \"otp\": \"123456\",\n  \"newPassword\": \"NewPassword123!\"\n}"
      }
    },
    {
      "_id": "req_logout",
      "_type": "request",
      "parentId": "fld_auth",
      "name": "Logout",
      "method": "POST",
      "url": "{{ base_url }}/auth/logout",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "fld_users",
      "_type": "request_group",
      "name": "Users",
      "environment": {}
    },
    {
      "_id": "req_get_me",
      "_type": "request",
      "parentId": "fld_users",
      "name": "Get Current User",
      "method": "GET",
      "url": "{{ base_url }}/users/me",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_update_profile",
      "_type": "request",
      "parentId": "fld_users",
      "name": "Update Profile",
      "method": "PUT",
      "url": "{{ base_url }}/users/me",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"bio\": \"Experienced full-stack developer\",\n  \"skills\": [\"React\", \"Node.js\", \"MongoDB\", \"TypeScript\"],\n  \"hourlyRate\": 60,\n  \"location\": \"San Francisco, USA\"\n}"
      }
    },
    {
      "_id": "req_upload_profile_pic",
      "_type": "request",
      "parentId": "fld_users",
      "name": "Upload Profile Picture",
      "method": "POST",
      "url": "{{ base_url }}/users/upload-profile-picture",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ],
      "body": {
        "mimeType": "multipart/form-data",
        "params": [
          {
            "name": "profilePicture",
            "type": "file",
            "fileName": ""
          }
        ]
      }
    },
    {
      "_id": "req_get_user_by_id",
      "_type": "request",
      "parentId": "fld_users",
      "name": "Get User by ID",
      "method": "GET",
      "url": "{{ base_url }}/users/{{ user_id }}",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_update_password",
      "_type": "request",
      "parentId": "fld_users",
      "name": "Update Password",
      "method": "PUT",
      "url": "{{ base_url }}/users/me/password",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"currentPassword\": \"OldPassword123!\",\n  \"newPassword\": \"NewPassword123!\"\n}"
      }
    },
    {
      "_id": "fld_jobs",
      "_type": "request_group",
      "name": "Jobs",
      "environment": {}
    },
    {
      "_id": "req_create_job",
      "_type": "request",
      "parentId": "fld_jobs",
      "name": "Create Job",
      "method": "POST",
      "url": "{{ base_url }}/jobs",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"title\": \"Build a React Dashboard\",\n  \"description\": \"Need a modern, responsive dashboard with charts and analytics\",\n  \"category\": \"Web Development\",\n  \"skills\": [\"React\", \"Tailwind CSS\", \"Chart.js\"],\n  \"budget\": {\n    \"min\": 500,\n    \"max\": 1000\n  },\n  \"duration\": \"1-2 weeks\",\n  \"experienceLevel\": \"intermediate\",\n  \"projectType\": \"fixed\"\n}"
      }
    },
    {
      "_id": "req_get_all_jobs",
      "_type": "request",
      "parentId": "fld_jobs",
      "name": "Get All Jobs",
      "method": "GET",
      "url": "{{ base_url }}/jobs?page=1&limit=10",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_search_jobs",
      "_type": "request",
      "parentId": "fld_jobs",
      "name": "Search Jobs with Filters",
      "method": "GET",
      "url": "{{ base_url }}/jobs?page=1&limit=10&category=Web Development&skills=React,Node.js&budget_min=500&budget_max=2000",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_get_job_by_id",
      "_type": "request",
      "parentId": "fld_jobs",
      "name": "Get Job by ID",
      "method": "GET",
      "url": "{{ base_url }}/jobs/{{ job_id }}",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_update_job",
      "_type": "request",
      "parentId": "fld_jobs",
      "name": "Update Job",
      "method": "PUT",
      "url": "{{ base_url }}/jobs/{{ job_id }}",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"title\": \"Build a React Dashboard (Updated)\",\n  \"budget\": {\n    \"min\": 600,\n    \"max\": 1200\n  }\n}"
      }
    },
    {
      "_id": "req_delete_job",
      "_type": "request",
      "parentId": "fld_jobs",
      "name": "Delete Job",
      "method": "DELETE",
      "url": "{{ base_url }}/jobs/{{ job_id }}",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_my_jobs",
      "_type": "request",
      "parentId": "fld_jobs",
      "name": "Get My Posted Jobs",
      "method": "GET",
      "url": "{{ base_url }}/jobs/my-jobs",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "fld_proposals",
      "_type": "request_group",
      "name": "Proposals",
      "environment": {}
    },
    {
      "_id": "req_submit_proposal",
      "_type": "request",
      "parentId": "fld_proposals",
      "name": "Submit Proposal",
      "method": "POST",
      "url": "{{ base_url }}/proposals",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"jobId\": \"{{ job_id }}\",\n  \"coverLetter\": \"I'm excited to work on this project. With 5 years of experience in React development...\",\n  \"proposedBudget\": 800,\n  \"estimatedDuration\": \"10 days\",\n  \"milestones\": [\n    {\n      \"title\": \"Design & Setup\",\n      \"amount\": 200,\n      \"duration\": \"2 days\"\n    },\n    {\n      \"title\": \"Development\",\n      \"amount\": 400,\n      \"duration\": \"5 days\"\n    },\n    {\n      \"title\": \"Testing & Deployment\",\n      \"amount\": 200,\n      \"duration\": \"3 days\"\n    }\n  ]\n}"
      }
    },
    {
      "_id": "req_get_job_proposals",
      "_type": "request",
      "parentId": "fld_proposals",
      "name": "Get Proposals for Job",
      "method": "GET",
      "url": "{{ base_url }}/proposals/job/{{ job_id }}",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_my_proposals",
      "_type": "request",
      "parentId": "fld_proposals",
      "name": "Get My Proposals",
      "method": "GET",
      "url": "{{ base_url }}/proposals/my-proposals",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_accept_proposal",
      "_type": "request",
      "parentId": "fld_proposals",
      "name": "Accept Proposal",
      "method": "PUT",
      "url": "{{ base_url }}/proposals/{{ proposal_id }}/accept",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_reject_proposal",
      "_type": "request",
      "parentId": "fld_proposals",
      "name": "Reject Proposal",
      "method": "PUT",
      "url": "{{ base_url }}/proposals/{{ proposal_id }}/reject",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_withdraw_proposal",
      "_type": "request",
      "parentId": "fld_proposals",
      "name": "Withdraw Proposal",
      "method": "DELETE",
      "url": "{{ base_url }}/proposals/{{ proposal_id }}",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "fld_messages",
      "_type": "request_group",
      "name": "Messages",
      "environment": {}
    },
    {
      "_id": "req_get_conversations",
      "_type": "request",
      "parentId": "fld_messages",
      "name": "Get All Conversations",
      "method": "GET",
      "url": "{{ base_url }}/messages/conversations",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_get_conversation_messages",
      "_type": "request",
      "parentId": "fld_messages",
      "name": "Get Messages in Conversation",
      "method": "GET",
      "url": "{{ base_url }}/messages/conversation/{{ conversation_id }}?page=1&limit=50",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_send_message",
      "_type": "request",
      "parentId": "fld_messages",
      "name": "Send Message",
      "method": "POST",
      "url": "{{ base_url }}/messages",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"recipientId\": \"{{ user_id }}\",\n  \"text\": \"Hello! I'd like to discuss the project\",\n  \"jobId\": \"{{ job_id }}\"\n}"
      }
    },
    {
      "_id": "req_upload_file",
      "_type": "request",
      "parentId": "fld_messages",
      "name": "Upload File Attachment",
      "method": "POST",
      "url": "{{ base_url }}/messages/upload",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ],
      "body": {
        "mimeType": "multipart/form-data",
        "params": [
          {
            "name": "file",
            "type": "file",
            "fileName": ""
          },
          {
            "name": "recipientId",
            "value": "{{ user_id }}"
          },
          {
            "name": "conversationId",
            "value": "{{ conversation_id }}"
          }
        ]
      }
    },
    {
      "_id": "req_mark_read",
      "_type": "request",
      "parentId": "fld_messages",
      "name": "Mark as Read",
      "method": "PUT",
      "url": "{{ base_url }}/messages/conversation/{{ conversation_id }}/read",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "fld_transactions",
      "_type": "request_group",
      "name": "Transactions",
      "environment": {}
    },
    {
      "_id": "req_get_wallet",
      "_type": "request",
      "parentId": "fld_transactions",
      "name": "Get Wallet Balance",
      "method": "GET",
      "url": "{{ base_url }}/transactions/wallet",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_get_transactions",
      "_type": "request",
      "parentId": "fld_transactions",
      "name": "Get Transaction History",
      "method": "GET",
      "url": "{{ base_url }}/transactions?page=1&limit=20",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_payment_intent",
      "_type": "request",
      "parentId": "fld_transactions",
      "name": "Create Payment Intent",
      "method": "POST",
      "url": "{{ base_url }}/transactions/payment-intent",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"jobId\": \"{{ job_id }}\",\n  \"amount\": 800,\n  \"milestoneId\": \"milestone_id_here\"\n}"
      }
    },
    {
      "_id": "req_release_payment",
      "_type": "request",
      "parentId": "fld_transactions",
      "name": "Release Payment",
      "method": "POST",
      "url": "{{ base_url }}/transactions/release",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"transactionId\": \"transaction_id_here\",\n  \"jobId\": \"{{ job_id }}\"\n}"
      }
    },
    {
      "_id": "req_withdraw",
      "_type": "request",
      "parentId": "fld_transactions",
      "name": "Request Withdrawal",
      "method": "POST",
      "url": "{{ base_url }}/transactions/withdraw",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"amount\": 1000,\n  \"method\": \"bank_transfer\",\n  \"accountDetails\": {\n    \"accountNumber\": \"1234567890\",\n    \"routingNumber\": \"123456789\",\n    \"accountHolderName\": \"John Doe\"\n  }\n}"
      }
    },
    {
      "_id": "fld_reviews",
      "_type": "request_group",
      "name": "Reviews",
      "environment": {}
    },
    {
      "_id": "req_create_review",
      "_type": "request",
      "parentId": "fld_reviews",
      "name": "Create Review",
      "method": "POST",
      "url": "{{ base_url }}/reviews",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"jobId\": \"{{ job_id }}\",\n  \"revieweeId\": \"{{ user_id }}\",\n  \"rating\": 5,\n  \"comment\": \"Excellent work! Very professional and delivered on time.\",\n  \"categories\": {\n    \"communication\": 5,\n    \"quality\": 5,\n    \"professionalism\": 5,\n    \"timeliness\": 4\n  }\n}"
      }
    },
    {
      "_id": "req_get_user_reviews",
      "_type": "request",
      "parentId": "fld_reviews",
      "name": "Get Reviews for User",
      "method": "GET",
      "url": "{{ base_url }}/reviews/user/{{ user_id }}?page=1&limit=10",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "fld_notifications",
      "_type": "request_group",
      "name": "Notifications",
      "environment": {}
    },
    {
      "_id": "req_get_notifications",
      "_type": "request",
      "parentId": "fld_notifications",
      "name": "Get All Notifications",
      "method": "GET",
      "url": "{{ base_url }}/notifications?page=1&limit=20",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_mark_notification_read",
      "_type": "request",
      "parentId": "fld_notifications",
      "name": "Mark Notification as Read",
      "method": "PUT",
      "url": "{{ base_url }}/notifications/notification_id_here/read",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "req_mark_all_read",
      "_type": "request",
      "parentId": "fld_notifications",
      "name": "Mark All as Read",
      "method": "PUT",
      "url": "{{ base_url }}/notifications/read-all",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ auth_token }}"
        }
      ]
    },
    {
      "_id": "fld_admin",
      "_type": "request_group",
      "name": "Admin",
      "environment": {}
    },
    {
      "_id": "req_admin_login",
      "_type": "request",
      "parentId": "fld_admin",
      "name": "Admin Login",
      "method": "POST",
      "url": "{{ base_url }}/admin/auth/login",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"admin@skillspocket.com\",\n  \"password\": \"AdminPassword123!\"\n}"
      }
    },
    {
      "_id": "req_admin_get_users",
      "_type": "request",
      "parentId": "fld_admin",
      "name": "Get All Users",
      "method": "GET",
      "url": "{{ base_url }}/admin/users?page=1&limit=20",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ admin_token }}"
        }
      ]
    },
    {
      "_id": "req_admin_suspend_user",
      "_type": "request",
      "parentId": "fld_admin",
      "name": "Suspend User",
      "method": "PUT",
      "url": "{{ base_url }}/admin/users/{{ user_id }}/suspend",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ admin_token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"reason\": \"Violation of terms of service\"\n}"
      }
    },
    {
      "_id": "req_admin_analytics",
      "_type": "request",
      "parentId": "fld_admin",
      "name": "Get Platform Analytics",
      "method": "GET",
      "url": "{{ base_url }}/admin/analytics",
      "headers": [
        {
          "name": "Authorization",
          "value": "Bearer {{ admin_token }}"
        }
      ]
    }
  ]
}

### 2. Get Reviews for User
**GET** `/reviews/user/:userId`
**Query:** `?page=1&limit=10`

### 3. Get Reviews for Job
**GET** `/reviews/job/:jobId`

### 4. Update Review
**PUT** `/reviews/:reviewId`
**Headers:** `Authorization: Bearer <token>`

### 5. Delete Review
**DELETE** `/reviews/:reviewId`
**Headers:** `Authorization: Bearer <token>`

---

## 🔔 Notification Endpoints

### 1. Get All Notifications
**GET** `/notifications`
**Headers:** `Authorization: Bearer <token>`
**Query:** `?page=1&limit=20&isRead=false`

### 2. Mark as Read
**PUT** `/notifications/:notificationId/read`
**Headers:** `Authorization: Bearer <token>`

### 3. Mark All as Read
**PUT** `/notifications/read-all`
**Headers:** `Authorization: Bearer <token>`

### 4. Delete Notification
**DELETE** `/notifications/:notificationId`
**Headers:** `Authorization: Bearer <token>`

---

## 🛡️ Admin Endpoints

### 1. Admin Login
**POST** `/admin/auth/login`

### 2. Get All Users
**GET** `/admin/users`
**Headers:** `Authorization: Bearer <admin_token>`
**Query:** `?page=1&limit=20&role=freelancer&status=active`

### 3. Suspend User
**PUT** `/admin/users/:userId/suspend`
**Headers:** `Authorization: Bearer <admin_token>`

### 4. Get Platform Analytics
**GET** `/admin/analytics`
**Headers:** `Authorization: Bearer <admin_token>`

### 5. Resolve Dispute
**PUT** `/admin/disputes/:disputeId/resolve`
**Headers:** `Authorization: Bearer <admin_token>`

---

## 🌐 WebSocket Events

### Client → Server Events

```javascript
// Connect
socket.emit('join', { userId: '507f1f77bcf86cd799439011' })

// Send message
socket.emit('send_message', {
  conversationId: '507f1f77bcf86cd799439014',
  text: 'Hello!',
  recipientId: '507f1f77bcf86cd799439015'
})

// Typing indicator
socket.emit('typing', { conversationId: '507f1f77bcf86cd799439014' })
socket.emit('stop_typing', { conversationId: '507f1f77bcf86cd799439014' })
````

### Server → Client Events

```javascript
// New message received
socket.on("new_message", (message) => {
  // Handle new message
});

// User typing
socket.on("user_typing", (data) => {
  // Show typing indicator
});

// Notification
socket.on("notification", (notification) => {
  // Show notification
});
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🔒 Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes
- **Standard endpoints**: 100 requests per 15 minutes
- **Upload endpoints**: 10 requests per hour

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads have a maximum size of 10MB
- Supported image formats: JPG, PNG, WEBP
- Supported document formats: PDF, DOC, DOCX
- All monetary values are in USD (cents can be handled as decimals)

## 🗺️ Roadmap

- ✅ Core marketplace (MVP)
- 🚧 Advanced filters & search
- 🚧 AI-based freelancer matching
- 📱 Mobile app (React Native)
- 🌍 Multi-language support

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add new feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request 🚀

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project, please give it a star ⭐ — it helps the project grow and motivates contributors!

---

<div align="center">
Built with ❤️ using React, Tailwind CSS, GSAP & Node.js
</div>

---

---

## 🎨 Design System & UX Principles

This project follows a token-based Tailwind design system to ensure consistency across dashboards, auth pages, and future features.

### Color Palette

| Token            | Value   | Usage                            |
| ---------------- | ------- | -------------------------------- |
| primary          | #137fec | Buttons, CTAs, links, highlights |
| background-light | #f6f7f8 | App background (light mode)      |
| background-dark  | #101922 | App background (dark mode)       |
| white            | #ffffff | Cards, surfaces                  |

### Typography

- **Font:** Manrope, sans-serif
- **Scale:**
  - Page titles: text-3xl / text-5xl, font-extrabold
  - Section titles: text-lg, font-bold
  - Body text: text-sm, font-medium
  - Labels: text-xs, font-semibold

### Spacing & Layout

- Dashboard max width: max-w-7xl
- Auth forms: max-w-[440px–480px]
- Grid system for cards, stats, forms
- Padding: Page (p-8), Card (p-5 → p-6), Buttons (py-3 → py-4)

### Border Radius

- Default: 0.25rem
- lg: 0.5rem
- xl: 0.75rem
- full: 9999px

### Dark Mode

- Enabled via Tailwind darkMode: "class"
- Uses neutral slate tones (no pure black)
- Preserves contrast and accessibility

### Component Design

- Cards: White surface, soft shadow, subtle border, rounded-xl
- Buttons: Primary (filled), Secondary (outline), active scale feedback

### UX Principles

- Visual trust: split-screen layout, testimonials, brand reinforcement
- Cognitive load reduction: single-column forms, clear inputs, password toggle
- Conversion optimization: strong CTA, minimal distractions, social login
- Accessibility: large tap targets, focus rings, high contrast

### Mobile Responsive

- Sidebar hidden on mobile, replaced by top nav
- Auth pages collapse to single column
- Tables: horizontal scroll enabled
- Touch-friendly spacing

---

## 📞 Contact

For questions, feedback, or support, please open an issue or contact the maintainer at [sharmasandesh66@gmail.com].

// ============================================
// FILE: backend/user/README.md
// ============================================

# skillspocket Backend API

Backend API for the skillspocket freelancing marketplace platform.

## Features

- User authentication and authorization
- Job posting and management
- Proposal submission and management
- Real-time messaging with Socket.io
- Payment processing with Stripe
- File uploads with Cloudinary
- Email notifications
- Transaction management
- Review and rating system

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Payment**: Stripe
- **Storage**: Cloudinary
- **Email**: Nodemailer

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLOUDINARY_*`: Cloudinary credentials
- `STRIPE_SECRET_KEY`: Stripe secret key
- `EMAIL_*`: Email service configuration

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- POST `/auth/verify-email` - Verify email with OTP
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/reset-password` - Reset password

### Users

- GET `/users/:id` - Get user profile
- PUT `/users/me` - Update own profile
- POST `/users/upload-profile-picture` - Upload profile picture

### Jobs

- GET `/jobs` - Get all jobs (with filters)
- GET `/jobs/:id` - Get job by ID
- POST `/jobs` - Create new job (client only)
- PUT `/jobs/:id` - Update job
- DELETE `/jobs/:id` - Delete job

### Proposals

- POST `/proposals` - Submit proposal (freelancer only)
- GET `/proposals/my-proposals` - Get own proposals
- GET `/proposals/job/:jobId` - Get proposals for job (client only)
- PUT `/proposals/:id/accept` - Accept proposal
- PUT `/proposals/:id/reject` - Reject proposal

### Messages

- GET `/messages/conversations` - Get all conversations
- GET `/messages/conversation/:id` - Get messages in conversation
- POST `/messages` - Send message
- PUT `/messages/conversation/:id/read` - Mark as read

### Transactions

- GET `/transactions/wallet` - Get wallet balance
- GET `/transactions` - Get transaction history
- POST `/transactions/payment-intent` - Create payment intent
- POST `/transactions/release` - Release payment
- POST `/transactions/withdraw` - Request withdrawal

### Reviews

- POST `/reviews` - Create review
- GET `/reviews/user/:userId` - Get user reviews
- GET `/reviews/job/:jobId` - Get job reviews

## Project Structure

```
backend/user/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── services/        # Business logic services
│   ├── socket/          # Socket.io handlers
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── uploads/             # Temporary file uploads
├── logs/                # Application logs
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- Helmet security headers
- CORS configuration
- MongoDB injection prevention

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## WebSocket Events

The API supports real-time features via Socket.io:

### Client → Server

- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server → Client

- `new_message` - New message received
- `user_typing` - Another user is typing
- `notification` - New notification

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## for admin backend

// ============================================
// FILE: backend/admin/README.md
// ============================================

# skillspocket Admin Backend

Admin panel backend API for managing the skillspocket platform.

## Features

- Admin authentication with role-based access
- User management (suspend, verify, delete)
- Job management (feature, delete)
- Dispute resolution system
- Platform analytics and reporting
- Financial monitoring
- Activity logging

## Installation

```bash
cd backend/admin
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

## API Endpoints

### Authentication

- POST `/api/admin/auth/login` - Admin login
- GET `/api/admin/auth/me` - Get current admin
- POST `/api/admin/auth/logout` - Logout
- PUT `/api/admin/auth/change-password` - Change password

### User Management

- GET `/api/admin/users` - Get all users
- GET `/api/admin/users/:userId` - Get user details
- PUT `/api/admin/users/:userId/suspend` - Suspend/unsuspend user
- PUT `/api/admin/users/:userId/verify` - Verify user
- DELETE `/api/admin/users/:userId` - Delete user

### Job Management

- GET `/api/admin/jobs` - Get all jobs
- DELETE `/api/admin/jobs/:jobId` - Delete job
- PUT `/api/admin/jobs/:jobId/feature` - Feature/unfeature job

### Disputes

- GET `/api/admin/disputes` - Get all disputes
- GET `/api/admin/disputes/:disputeId` - Get dispute details
- PUT `/api/admin/disputes/:disputeId/assign` - Assign dispute
- PUT `/api/admin/disputes/:disputeId/resolve` - Resolve dispute
- POST `/api/admin/disputes/:disputeId/messages` - Add message

### Analytics

- GET `/api/admin/analytics` - Get platform analytics
- GET `/api/admin/analytics/financial` - Get financial analytics

## Admin Roles & Permissions

### Super Admin

- Full access to all features
- Can manage other admins
- Can delete users permanently

### Admin

- Manage users (suspend, verify)
- Manage jobs
- View analytics
- Resolve disputes

### Moderator

- Manage jobs
- Resolve disputes
- Limited user management

## Security

- JWT authentication
- Role-based access control
- Account lockout after failed attempts
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- Helmet security headers

## License

MIT

Complete Admin Backend Fix
Problem
The admin backend was trying to import models from the user backend using relative paths like ../../user/src/models/User, which caused MODULE_NOT_FOUND errors.
Solution
Create all necessary models in the admin backend that connect to the same MongoDB database.

Files to Create/Update
📁 Models Directory: backend/admin/src/models/
Create these 6 model files:

✅ User.js - User model
✅ Job.js - Job model
✅ Proposal.js - Proposal model
✅ Transaction.js - Transaction model
✅ Admin.js - Admin model (NEW)
✅ Dispute.js - Dispute model (NEW)

📁 Controllers Directory: backend/admin/src/controllers/
Update these 3 controller files (changed imports from ../../user/src/models/ to ../models/):

✅ userManagementController.js - UPDATED
✅ jobManagementController.js - UPDATED
✅ disputeController.js - UPDATED
✅ analyticsController.js - UPDATED
✅ adminAuthController.js - Already correct (no changes needed)

📁 Utils Directory: backend/admin/src/utils/

✅ logger.js - Winston logger utility (NEW)

Installation Steps
Step 1: Install Dependencies
bashcd backend/admin
npm install winston bcryptjs jsonwebtoken
Step 2: Create Directory Structure
bashmkdir -p src/models src/utils logs
Step 3: Copy All Files
Copy the code from all the artifacts I provided above into the corresponding files in your admin backend.
Models to create:

backend/admin/src/models/User.js
backend/admin/src/models/Job.js
backend/admin/src/models/Proposal.js
backend/admin/src/models/Transaction.js
backend/admin/src/models/Admin.js
backend/admin/src/models/Dispute.js

Utils to create:

backend/admin/src/utils/logger.js

Controllers to update:

backend/admin/src/controllers/userManagementController.js
backend/admin/src/controllers/jobManagementController.js
backend/admin/src/controllers/disputeController.js
backend/admin/src/controllers/analyticsController.js

Step 4: Verify Your .env File
Make sure your backend/admin/.env has:
env# MongoDB - SAME database as user backend
MONGO_URI=mongodb://localhost:27017/skillspocket

# JWT

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Server

NODE_ENV=development
PORT=5001

# Logging

LOG_LEVEL=info
Step 5: Start the Server
bashnpm run dev

Expected Directory Structure
backend/admin/
├── src/
│ ├── models/
│ │ ├── User.js ✓ CREATED
│ │ ├── Job.js ✓ CREATED
│ │ ├── Proposal.js ✓ CREATED
│ │ ├── Transaction.js ✓ CREATED
│ │ ├── Admin.js ✓ CREATED
│ │ └── Dispute.js ✓ CREATED
│ ├── controllers/
│ │ ├── adminAuthController.js ✓ OK
│ │ ├── userManagementController.js ✓ UPDATED
│ │ ├── jobManagementController.js ✓ UPDATED
│ │ ├── disputeController.js ✓ UPDATED
│ │ └── analyticsController.js ✓ UPDATED
│ ├── utils/
│ │ └── logger.js ✓ CREATED
│ ├── routes/
│ ├── middlewares/
│ ├── app.js
│ └── server.js
├── logs/ ✓ CREATED
├── .env
└── package.json

What Changed?
Before (WRONG):
javascriptconst User = require('../../user/src/models/User'); // ❌ Cross-backend import
const Job = require('../../user/src/models/Job'); // ❌ Won't work
After (CORRECT):
javascriptconst User = require('../models/User'); // ✅ Local model
const Job = require('../models/Job'); // ✅ Works perfectly
const logger = require('../utils/logger'); // ✅ Added logger

Key Points

Same Database: Both user and admin backends connect to the same MongoDB database (skillspocket)
Independent Services: Each backend has its own models but shares the same database
Proper Architecture: This follows microservices best practices
No Cross-Dependencies: Admin backend doesn't depend on user backend files

Testing After Fix
Once the server starts successfully, test these endpoints:
Admin Auth
bash# Login
POST http://localhost:5001/api/admin/auth/login
User Management
bash# Get all users
GET http://localhost:5001/api/admin/users
Job Management
bash# Get all jobs
GET http://localhost:5001/api/admin/jobs
Analytics
bash# Get platform analytics
GET http://localhost:5001/api/admin/analytics

Troubleshooting
If you still get errors:

"Cannot find module" → Make sure all model files exist in src/models/
"winston not found" → Run npm install winston
"bcryptjs not found" → Run npm install bcryptjs jsonwebtoken
Database connection error → Check MONGO_URI in .env
Port already in use → Change PORT in .env or stop other services

Success Indicator
You should see:
[nodemon] starting `node src/server.js`
✓ MongoDB connected
✓ Admin server running on port 5001
If you see these messages without any MODULE_NOT_FOUND errors, you're all set! 🎉
