# 🧪 Testing Backend API - Panggon Sinau

Backend API sudah berjalan di: **http://localhost:5000**

---

## 📝 Penjelasan Environment Variables (.env)

File `.env` berisi konfigurasi penting untuk backend:

```env
PORT=5000                          # Port backend server
MONGODB_URI=mongodb://localhost:27017/Website_Panggon_Sinau  # Koneksi MongoDB
JWT_SECRET=panggon-sinau-jwt-secret-key-2025-production-change-this-to-random-string  # Secret key untuk enkripsi JWT
NODE_ENV=development               # Environment mode
FRONTEND_URL=http://localhost:3000 # URL frontend untuk CORS
```

### Penjelasan JWT_SECRET:
- **JWT_SECRET** adalah kunci rahasia untuk mengenkripsi token authentication
- Seperti password untuk sistem token
- **PENTING**: Ganti dengan string random yang kuat di production
- Contoh generate JWT_SECRET yang kuat:
  ```javascript
  // Di Node.js console
  require('crypto').randomBytes(64).toString('hex')
  ```

---

## 🚀 Cara Testing API

### 1️⃣ Register User Baru

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Fatihul Qolbi",
  "email": "fatihul@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65abc123...",
    "name": "Fatihul Qolbi",
    "email": "fatihul@example.com",
    "avatar": "",
    "preferences": {
      "pomodoroTime": 25,
      "breakTime": 5,
      "theme": "system"
    },
    "stats": {
      "totalPomodoros": 0,
      "totalFocusTime": 0,
      "gamesPlayed": 0
    }
  }
}
```

**⚠️ Simpan `token` dari response untuk request selanjutnya!**

---

### 2️⃣ Login User

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "fatihul@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

### 3️⃣ Get Current User (dengan Token)

**Endpoint:** `GET http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "65abc123...",
    "name": "Fatihul Qolbi",
    "email": "fatihul@example.com",
    ...
  }
}
```

---

## ✅ Todo/Task Management (Dashboard)

### 4️⃣ Create Todo

**Endpoint:** `POST http://localhost:5000/api/todos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "Belajar Node.js dan Express",
  "description": "Pelajari cara membuat REST API dengan Express dan MongoDB",
  "category": "Study",
  "priority": "High",
  "dueDate": "2025-02-28",
  "tags": ["programming", "backend", "nodejs"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "todo": {
    "_id": "65xyz...",
    "user": "65abc123...",
    "title": "Belajar Node.js dan Express",
    "description": "Pelajari cara membuat REST API dengan Express dan MongoDB",
    "category": "Study",
    "priority": "High",
    "status": "pending",
    "isCompleted": false,
    "dueDate": "2025-02-28T00:00:00.000Z",
    "tags": ["programming", "backend", "nodejs"],
    "createdAt": "2025-02-15T10:30:00.000Z",
    "updatedAt": "2025-02-15T10:30:00.000Z"
  }
}
```

---

### 5️⃣ Get All Todos

**Endpoint:** `GET http://localhost:5000/api/todos`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters (Optional):**
- `?status=pending` - Filter by status
- `?category=Study` - Filter by category
- `?priority=High` - Filter by priority
- `?isCompleted=false` - Filter completed/pending
- `?sortBy=-createdAt` - Sort (- untuk descending)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "todos": [
    {
      "_id": "65xyz...",
      "title": "Belajar Node.js dan Express",
      "category": "Study",
      "priority": "High",
      "status": "pending",
      "isCompleted": false,
      ...
    },
    ...
  ]
}
```

---

### 6️⃣ Update Todo

**Endpoint:** `PUT http://localhost:5000/api/todos/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "Belajar Node.js, Express, dan MongoDB",
  "status": "in-progress",
  "priority": "Urgent"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "todo": { ... }
}
```

---

### 7️⃣ Toggle Todo Completion

**Endpoint:** `PATCH http://localhost:5000/api/todos/:id/toggle`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "Todo marked as completed",
  "todo": {
    ...
    "isCompleted": true,
    "status": "completed",
    "completedAt": "2025-02-15T15:30:00.000Z"
  }
}
```

---

### 8️⃣ Delete Todo (Hard Delete)

**Endpoint:** `DELETE http://localhost:5000/api/todos/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "message": "Todo deleted successfully",
  "todo": { ... }
}
```

---

### 9️⃣ Get Todo Statistics

**Endpoint:** `GET http://localhost:5000/api/todos/stats/summary`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "completed": 5,
    "pending": 3,
    "inProgress": 2,
    "overdue": 1,
    "byCategory": {
      "Study": 4,
      "Work": 3,
      "Personal": 2,
      "Health": 1
    },
    "byPriority": {
      "High": 3,
      "Medium": 5,
      "Low": 2
    }
  }
}
```

---

## 📅 Calendar Events

### 🔟 Create Calendar Event

**Endpoint:** `POST http://localhost:5000/api/events`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "Team Meeting",
  "description": "Diskusi project planning",
  "startTime": "09:00",
  "endTime": "10:30",
  "date": 20,
  "month": 2,
  "year": 2025,
  "category": "Work",
  "location": "Meeting Room A"
}
```

---

### 1️⃣1️⃣ Get All Events

**Endpoint:** `GET http://localhost:5000/api/events?year=2025&month=2`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 1️⃣2️⃣ Update Event

**Endpoint:** `PUT http://localhost:5000/api/events/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "Updated Team Meeting",
  "startTime": "10:00",
  "endTime": "11:30"
}
```

---

### 1️⃣3️⃣ Delete Event (Hard Delete)

**Endpoint:** `DELETE http://localhost:5000/api/events/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📝 Notes Management

### 1️⃣4️⃣ Create Note

**Endpoint:** `POST http://localhost:5000/api/notes`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "title": "Catatan Express.js",
  "content": "## Middleware\n\nMiddleware adalah function yang dijalankan sebelum route handler...",
  "category": "Study",
  "tags": ["nodejs", "express", "backend"]
}
```

---

### 1️⃣5️⃣ Get All Notes

**Endpoint:** `GET http://localhost:5000/api/notes`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters:**
- `?category=Study`
- `?search=express`

---

### 1️⃣6️⃣ Update Note

**Endpoint:** `PUT http://localhost:5000/api/notes/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 1️⃣7️⃣ Delete Note (Hard Delete)

**Endpoint:** `DELETE http://localhost:5000/api/notes/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🍅 Pomodoro Sessions

### 1️⃣8️⃣ Log Pomodoro Session

**Endpoint:** `POST http://localhost:5000/api/pomodoro`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "type": "focus",
  "duration": 1500,
  "taskName": "Coding Backend API",
  "notes": "Completed Todo CRUD endpoints"
}
```

**Type Options:**
- `focus` - Sesi fokus (25 menit = 1500 detik)
- `break` - Short break (5 menit = 300 detik)
- `long-break` - Long break (15 menit = 900 detik)

---

## 📊 Statistics

### 1️⃣9️⃣ Dashboard Stats

**Endpoint:** `GET http://localhost:5000/api/stats/dashboard`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### 2️⃣0️⃣ Productivity Trends

**Endpoint:** `GET http://localhost:5000/api/stats/productivity?days=7`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔍 Cara Melihat Data di MongoDB Compass

1. **Buka MongoDB Compass**
2. **Connect ke:** `mongodb://localhost:27017`
3. **Pilih Database:** `Website_Panggon_Sinau`
4. **Collections yang tersedia:**
   - `users` - Data user (email, password, preferences)
   - `todos` - To-do list / tasks
   - `events` - Calendar events
   - `notes` - Notes/catatan
   - `pomoodorosessions` - Pomodoro tracking

5. **Lihat Data:**
   - Klik collection name
   - Akan muncul semua documents/data
   - Bisa filter, sort, dan edit langsung

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

**Solusi:** Pastikan header `Authorization: Bearer TOKEN` sudah benar

---

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

**Solusi:** Cek field yang required di request body

---

### 404 Not Found
```json
{
  "success": false,
  "message": "Todo not found"
}
```

**Solusi:** Pastikan ID yang digunakan benar dan data exist

---

## 🎯 Testing Flow Lengkap

### Step 1: Register
```bash
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Step 2: Simpan Token
Copy token dari response dan gunakan untuk semua request selanjutnya

### Step 3: Create Todo
```bash
POST /api/todos
Authorization: Bearer YOUR_TOKEN
{
  "title": "My First Todo",
  "category": "Personal",
  "priority": "Medium"
}
```

### Step 4: Get All Todos
```bash
GET /api/todos
Authorization: Bearer YOUR_TOKEN
```

### Step 5: Cek di MongoDB Compass
- Buka collection `todos`
- Lihat data yang baru dibuat

---

## 🔐 Security Notes

1. **JWT Token** berlaku selama **7 hari**
2. **Password** otomatis di-hash dengan bcrypt
3. **Semua endpoint** (kecuali auth) memerlukan JWT token
4. **JWT_SECRET** harus di-ganti di production dengan string random yang kuat

---

## 📞 Health Check

**Endpoint:** `GET http://localhost:5000/health`

**Response:**
```json
{
  "status": "OK",
  "message": "Panggon Sinau API is running",
  "timestamp": "2025-02-15T10:30:00.000Z"
}
```

---

**Happy Testing! 🚀**
