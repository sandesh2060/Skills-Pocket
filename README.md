# 🚀 SkillsProcket – Premium Freelancing Marketplace

<div align="center">
  <img src="https://your-logo-url.com/logo.png" alt="SkillsProcket Logo" width="120" />
  <h2>A modern, premium freelancing marketplace connecting top talent with global clients</h2>
  <a href="#live-demo">Live Demo</a> • <a href="#documentation">Documentation</a> • <a href="#contributing">Contribute</a> • <a href="#support">Support</a>
</div>

---

<div align="center">
  <img src="https://your-logo-url.com/logo.png" alt="SkillsProcket Logo" width="120" />
  <h2>A modern, premium freelancing marketplace connecting top talent with global clients</h2>
  <a href="#live-demo">Live Demo</a> • <a href="#documentation">Documentation</a> • <a href="#contributing">Contribute</a> • <a href="#support">Support</a>
</div>

---

## 📌 Overview

**SkillsProcket** is a full-stack freelancing marketplace inspired by platforms like Upwork, Fiverr, and Freelancer. It features a premium UI, modern animations, and scalable architecture.

Clients can post projects, hire freelancers, manage milestones, and make secure payments. Freelancers can build professional profiles, submit proposals, communicate in real time, and track earnings.

---

## ✨ What Makes SkillsProcket Different?

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
skillsprocket/
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
git clone https://github.com/yourusername/skillsprocket.git
cd skillsprocket

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
Production: https://api.skillsprocket.com/api
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
      "_id": "wrk_skillsprocket",
      "_type": "workspace",
      "name": "SkillsProcket API",
      "description": "Complete API collection for SkillsProcket freelancing marketplace"
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
        "base_url": "https://api.skillsprocket.com/api"
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
        "text": "{\n  \"email\": \"admin@skillsprocket.com\",\n  \"password\": \"AdminPassword123!\"\n}"
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
