# 🔐 AuthApp — React + Node.js + MongoDB

A production-ready authentication system with signup, login, and protected dashboard.

## 🛠️ Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Bootstrap 5       |
| Backend  | Node.js, Express                  |
| Database | MongoDB + Mongoose                |
| Auth     | JWT (jsonwebtoken) + bcryptjs     |

---

## 📁 Project Structure

```
auth-app/
├── backend/
│   ├── middleware/auth.js     # JWT guard middleware
│   ├── models/User.js         # Mongoose user schema
│   ├── routes/auth.js         # Auth API routes
│   ├── server.js              # Express app entry
│   ├── .env                   # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx       # Login page
    │   │   ├── Signup.jsx      # Signup page
    │   │   └── Dashboard.jsx   # Protected dashboard
    │   ├── App.jsx             # Routes
    │   ├── api.js              # Axios instance
    │   ├── index.css           # Global styles
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ installed → https://nodejs.org
- **MongoDB** installed and running locally → https://www.mongodb.com/try/download/community
  - OR use **MongoDB Atlas** (free cloud): https://cloud.mongodb.com

---

### Step 1 — Start MongoDB

**Local MongoDB:**
```bash
mongod
```
Or if installed as a service it may already be running.

**MongoDB Atlas:**  
Get your connection string from Atlas dashboard and update `backend/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/authdb
```

---

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Edit `backend/.env` if needed:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint            | Auth Required | Description        |
|--------|---------------------|---------------|--------------------|
| POST   | /api/auth/signup    | ❌            | Register new user  |
| POST   | /api/auth/login     | ❌            | Login user         |
| GET    | /api/auth/profile   | ✅ Bearer JWT | Get user profile   |
| PUT    | /api/auth/profile   | ✅ Bearer JWT | Update profile     |
| POST   | /api/auth/logout    | ✅ Bearer JWT | Logout             |

---

## 🔐 How Auth Works

1. User signs up → password hashed with bcrypt (12 rounds)
2. JWT token generated → sent to frontend
3. Frontend stores token in `localStorage`
4. All protected API calls include `Authorization: Bearer <token>`
5. Backend verifies token on every protected route
6. Token expires in 7 days

---

## 🧪 Test the API with curl

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'

# Profile (replace TOKEN with the token from login)
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB not connecting | Make sure `mongod` is running |
| CORS error | Backend is set to allow `localhost:5173` and `localhost:3000` |
| Port in use | Change `PORT` in `.env` |
| Token expired | Log out and log in again |
