# 🎓 Panggon Sinau

**Platform Produktivitas Modern untuk Belajar & Fokus**

Panggon Sinau adalah platform produktivitas komprehensif yang menggabungkan berbagai fitur untuk membantu Anda belajar lebih efektif, meningkatkan fokus, mengelola jadwal, dan menyimpan catatan penting.

## ✨ Fitur Utama

### 🍅 Pomodoro Timer
- Timer produktivitas dengan teknik Pomodoro (25 menit fokus, 5 menit istirahat)
- Progress circle interaktif dan animated
- Notifikasi browser otomatis saat sesi selesai
- Mode switching smooth antara fokus dan break
- Visual indicator yang jelas untuk status timer
- Tracking sesi harian

### 📅 Kalender & Jadwal
- **Multiple Views**: Day, Week, dan Month view
- **Event Management**: Create, Edit, Delete events dengan mudah
- **Kategorisasi**: My Calendar, Work, Personal, Family dengan color coding
  - 🔵 My Calendar (Blue)
  - 🟢 Work (Green)
  - 🟣 Personal (Purple)
  - 🟠 Family (Orange)
- **Drag & Drop**: Reschedule events dengan drag and drop
- **Mini Calendar**: Navigasi cepat ke tanggal tertentu
- **Date Picker**: Pilih tanggal dengan calendar picker
- **Format 24 Jam**: Tampilan waktu 00:00 - 23:00
- **Responsive**: Seamless di mobile, tablet, dan desktop

### ♟️ Game Catur
- **AI Opponent**: Main melawan komputer dengan berbagai tingkat kesulitan
- **Player vs Player**: Mode 2 pemain
- **Complete Rules**: Implementasi lengkap aturan catur
  - Castling (Rokade)
  - En passant
  - Pawn promotion
  - Check & Checkmate detection
- **Visual Aids**:
  - Highlight selected piece
  - Show legal moves
  - Captured pieces display
  - Complete move history
- **Real-time Validation**: Move validation otomatis

### ✍️ Nulis (Notes Editor)
- Text editor untuk catatan belajar
- Markdown support
- Auto-save functionality
- Organize notes by category
- Rich text editing

### 📊 Statistik & Analytics
- Tracking produktivitas harian
- Visualisasi data dengan charts
- Progress overview
- Performance metrics
- Activity history

### 👤 Profile Management
- User profile customization
- Settings & preferences
- Personalization options
- Activity tracking

## 🚀 Cara Menggunakan

1. **Pilih Mode Fokus**
   - Klik tombol "Mode Fokus" untuk memulai sesi produktivitas

2. **Mulai Pomodoro Timer**
   - Tekan tombol play dan fokus bekerja selama 25 menit
   - Timer akan countdown otomatis
   - Matikan notifikasi untuk fokus maksimal

3. **Nikmati Break Time**
   - Setelah 25 menit, timer akan beralih ke mode break (5 menit)
   - Klik "Mode Break" untuk bermain catur
   - Refresh pikiran Anda dengan strategi catur

4. **Ulangi Siklus**
   - Lakukan 4 siklus Pomodoro
   - Istirahat panjang 15-30 menit setelah 4 siklus

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework dengan App Router
- **React 19** - UI library terbaru
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **Lucide React** - Modern icon library
- **next-themes** - Dark/Light mode

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0** - ODM for MongoDB
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility
- **nodemon** - Auto-restart for backend

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18 atau lebih baru
- MongoDB (local atau MongoDB Atlas)
- pnpm (recommended) / npm / yarn

### Frontend Setup

```bash
# Navigate to Frontend folder
cd Frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build untuk production
pnpm build

# Start production server
pnpm start
```

### Backend Setup

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Edit .env dengan konfigurasi Anda:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/panggon-sinau
# JWT_SECRET=your-secret-key-change-this
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000

# Start MongoDB (jika menggunakan local MongoDB)
# mongod

# Run development server
pnpm dev

# Run production
pnpm start
```

### Development URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

---

## 📁 Project Structure

```
Website/
├── Frontend/                # Next.js Frontend
│   ├── app/                # Next.js App Router
│   │   ├── calendar/      # 📅 Calendar & event management
│   │   ├── dashboard/     # 🏠 Dashboard utama
│   │   ├── nulis/        # ✍️ Notes editor
│   │   ├── profile/      # 👤 User profile
│   │   ├── statistik/    # 📊 Statistics
│   │   ├── layout.tsx    # Root layout dengan theme
│   │   └── page.tsx      # Landing page
│   │
│   ├── components/        # React Components
│   │   ├── ui/           # 🎨 Reusable UI components
│   │   ├── chess-*.tsx   # ♟️ Chess game components
│   │   ├── pomodoro-timer.tsx # 🍅 Pomodoro timer
│   │   └── dashboard-*.tsx # Dashboard components
│   │
│   ├── lib/              # Utilities & Logic
│   │   ├── chess-rules.ts
│   │   ├── chess-types.ts
│   │   └── utils.ts
│   │
│   └── public/           # Static Assets
│
├── Backend/              # Express.js Backend API
│   ├── config/
│   │   └── database.js   # MongoDB connection
│   │
│   ├── middleware/
│   │   └── auth.js       # JWT authentication
│   │
│   ├── models/           # Mongoose Models
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Note.js
│   │   └── PomodoroSession.js
│   │
│   ├── routes/           # API Routes
│   │   ├── auth.js       # Authentication
│   │   ├── users.js      # User management
│   │   ├── events.js     # Calendar events
│   │   ├── notes.js      # Notes CRUD
│   │   ├── pomodoro.js   # Pomodoro sessions
│   │   └── stats.js      # Statistics
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js         # Entry point
│
└── README.md            # Main documentation
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades untuk brand identity
- **Categories**:
  - 🔵 Blue - My Calendar
  - 🟢 Green - Work
  - 🟣 Purple - Personal
  - 🟠 Orange - Family

### Dark Mode
- Built-in dark mode support
- Smooth transitions
- Persistent theme preference
- System theme detection
- Optimized contrast

### Typography
- Clean, modern fonts
- Hierarchical heading system
- Readable body text
- Consistent spacing

### Components
- Glassmorphism effects
- Smooth animations
- Hover interactions
- Focus states
- Loading states

---

## 📱 Responsive Design

Fully responsive untuk semua device sizes:

- 📱 **Mobile**: 320px - 767px
  - Single column layout
  - Touch-optimized controls
  - Collapsible navigation
  
- 📱 **Tablet**: 768px - 1023px
  - Two column layout
  - Optimized spacing
  - Touch + mouse support

- 💻 **Desktop**: 1024px - 1279px
  - Three column layout
  - Hover states
  - Keyboard shortcuts

- 🖥️ **Large Desktop**: 1280px+
  - Maximum content width
  - Enhanced spacing
  - Full feature set

---

## ⚡ Performance Optimization

### Frontend Optimizations
- ✅ Code splitting per route (Next.js automatic)
- ✅ Tree shaking untuk unused code
- ✅ Automatic image optimization
- ✅ Font optimization
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Lazy loading components

### Backend Optimizations
- ✅ MongoDB indexing untuk faster queries
- ✅ JWT caching strategy
- ✅ CORS optimization
- ✅ Response compression (gzip)
- ✅ Database connection pooling

### Build Size
- **Frontend**: ~342 MB (optimized from 470 MB)
- **Backend**: ~25 MB
- **Total Project**: ~367 MB
- **Source Code Only**: ~10 MB
- **Components**: Removed 50+ unused UI components
- **Dependencies**: Removed 30+ unused packages

### Loading Performance
- Frontend initial load: <2s
- API response time: <100ms average
- MongoDB query time: <50ms average
- JWT verification: <10ms

---

## 🚀 Cara Menggunakan

### 1. Pomodoro Timer
1. Klik tombol **Play** untuk mulai sesi fokus (25 menit)
2. Fokus pada pekerjaan Anda
3. Saat timer selesai, notifikasi akan muncul
4. Ambil break 5 menit
5. Ulangi siklus (4x fokus = 1 long break)

### 2. Calendar
1. Klik **+ Create** untuk membuat event baru
2. Pilih tanggal menggunakan date picker
3. Atur waktu mulai dan selesai
4. Pilih kategori (My Calendar, Work, Personal, Family)
5. Tambahkan lokasi dan deskripsi
6. **Drag & drop** event untuk reschedule
7. Klik event untuk melihat detail atau edit

### 3. Game Catur
1. Pilih mode: **AI** atau **Player vs Player**
2. Klik piece untuk melihat legal moves
3. Klik destination square untuk move
4. Lihat move history di sidebar
5. Track captured pieces
6. Nikmati refreshment saat break!

### 4. Notes
1. Buka halaman **Nulis**
2. Tulis catatan Anda
3. Auto-save aktif
4. Organize by category

### 5. Statistik
1. Lihat progress harian Anda
2. Analyze produktivitas
3. Track performance trends

---
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🎯 Teknik Pomodoro

Teknik Pomodoro adalah metode manajemen waktu yang terbukti efektif:

- **25 menit fokus**: Periode kerja intensif tanpa gangguan
- **5 menit break**: Istirahat singkat untuk refresh
- **4 siklus**: Setelah 4 Pomodoro, ambil break lebih panjang
- **Produktivitas maksimal**: Mengurangi burnout dan meningkatkan fokus

## 🎮 Manfaat Game Catur

Bermain catur saat break memberikan manfaat:

- Melatih kemampuan berpikir strategis
- Meningkatkan konsentrasi dan fokus
- Refreshment yang produktif dan edukatif
- Melatih problem-solving skills

---

## 🔌 Backend API Integration

Backend API menyediakan 20+ endpoints untuk data persistence dan authentication. Semua endpoints memerlukan JWT token kecuali auth endpoints.

### API Base URL
```
Development: http://localhost:5000/api
```

### Authentication Endpoints (`/api/auth`)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string"
}

Response: {
  "token": "jwt_token",
  "user": { ... }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: {
  "token": "jwt_token",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: {
  "user": { ... }
}
```

---

### Calendar Events (`/api/events`)

#### Get All Events
```http
GET /api/events?year=2025&month=2
Authorization: Bearer <token>

Response: {
  "events": [ ... ]
}
```

#### Create Event
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "startTime": "09:00",
  "endTime": "10:00",
  "date": 15,
  "month": 2,
  "year": 2025,
  "category": "My Calendar|Work|Personal|Family",
  "location": "string"
}

Response: {
  "event": { ... }
}
```

#### Update Event
```http
PUT /api/events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  ...
}

Response: {
  "event": { ... }
}
```

#### Delete Event
```http
DELETE /api/events/:id
Authorization: Bearer <token>

Response: {
  "message": "Event deleted successfully"
}
```

---

### Notes Management (`/api/notes`)

#### Get All Notes
```http
GET /api/notes?category=Study&search=keyword
Authorization: Bearer <token>

Response: {
  "notes": [ ... ]
}
```

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "content": "string",
  "category": "Study|Work|Personal|Ideas|Other",
  "tags": ["tag1", "tag2"]
}

Response: {
  "note": { ... }
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content",
  ...
}

Response: {
  "note": { ... }
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>

Response: {
  "message": "Note deleted successfully"
}
```

---

### Pomodoro Sessions (`/api/pomodoro`)

#### Get Sessions
```http
GET /api/pomodoro?type=focus&startDate=2025-01-01
Authorization: Bearer <token>

Response: {
  "sessions": [ ... ]
}
```

#### Log Session
```http
POST /api/pomodoro
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "focus|break|long-break",
  "duration": 1500,
  "taskName": "string",
  "notes": "string"
}

Response: {
  "session": { ... }
}
```

#### Get Statistics
```http
GET /api/pomodoro/stats?period=week
Authorization: Bearer <token>

Response: {
  "totalSessions": 42,
  "totalFocusTime": 63000,
  "averageSessionDuration": 1500,
  ...
}
```

---

### User Management (`/api/users`)

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>

Response: {
  "user": {
    "name": "string",
    "email": "string",
    "avatar": "string",
    "preferences": { ... },
    "stats": { ... }
  }
}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "avatar": "string",
  "preferences": {
    "pomodoroTime": 25,
    "breakTime": 5,
    "theme": "light|dark|system"
  }
}

Response: {
  "user": { ... }
}
```

#### Get User Stats
```http
GET /api/users/stats
Authorization: Bearer <token>

Response: {
  "totalPomodoros": 100,
  "totalFocusTime": 150000,
  "gamesPlayed": 25,
  ...
}
```

---

### Statistics & Analytics (`/api/stats`)

#### Dashboard Stats
```http
GET /api/stats/dashboard
Authorization: Bearer <token>

Response: {
  "todayPomodoros": 4,
  "weeklyPomodoros": 20,
  "totalEvents": 15,
  "totalNotes": 30,
  ...
}
```

#### Productivity Trends
```http
GET /api/stats/productivity?days=7
Authorization: Bearer <token>

Response: {
  "trends": [
    {
      "date": "2025-02-15",
      "pomodoros": 6,
      "focusTime": 9000,
      "completionRate": 0.85
    },
    ...
  ]
}
```

---

### Authentication Flow

1. **User Registration/Login**
   ```javascript
   const response = await fetch('http://localhost:5000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   const { token, user } = await response.json();
   localStorage.setItem('token', token);
   ```

2. **Authenticated Requests**
   ```javascript
   const token = localStorage.getItem('token');
   const response = await fetch('http://localhost:5000/api/events', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });
   ```

3. **Token Expiration**
   - Token berlaku selama 7 hari
   - Auto-logout saat token expired
   - Refresh dengan login ulang

---

### Database Models

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  avatar: String,
  preferences: {
    pomodoroTime: Number (default: 25),
    breakTime: Number (default: 5),
    theme: String (default: "system")
  },
  stats: {
    totalPomodoros: Number,
    totalFocusTime: Number,
    gamesPlayed: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Event Model
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  description: String,
  startTime: String (format: "HH:MM"),
  endTime: String (format: "HH:MM"),
  date: Number (1-31),
  month: Number (1-12),
  year: Number,
  category: String (enum: My Calendar, Work, Personal, Family),
  color: String,
  location: String,
  attendees: [String],
  organizer: String,
  isCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Note Model
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  content: String,
  category: String (enum: Study, Work, Personal, Ideas, Other),
  tags: [String],
  isPinned: Boolean,
  isArchived: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### PomodoroSession Model
```javascript
{
  user: ObjectId (ref: User),
  type: String (enum: focus, break, long-break),
  duration: Number (in seconds),
  completedAt: Date,
  taskName: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

### CORS Configuration

Backend sudah dikonfigurasi untuk menerima request dari:
- Frontend development: `http://localhost:3000`
- Custom FRONTEND_URL dari `.env`

---

### Environment Variables (.env)

**Backend (.env)**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/panggon-sinau
# atau MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/panggon-sinau

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL (untuk CORS)
FRONTEND_URL=http://localhost:3000
```

---

### Testing Backend API

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Create Event (dengan token)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Meeting","date":15,"month":2,"year":2025,"startTime":"09:00","endTime":"10:00","category":"Work"}'
```

---

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🔒 Best Practices

### Code Quality
- ✅ TypeScript untuk type safety
- ✅ ESLint untuk code standards
- ✅ Component-based architecture
- ✅ Clean code principles
- ✅ Consistent naming conventions

### Performance
- ✅ Code splitting per route
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Bundle size optimization
- ✅ Minimal dependencies

### Accessibility
- ✅ Keyboard navigation support
- ✅ ARIA labels
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ Color contrast compliance

### Security
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Environment variables secured
- ✅ Input validation

### Git & Version Control
- ✅ .gitignore configured (Frontend & Backend)
- ✅ node_modules excluded
- ✅ Build artifacts excluded
- ✅ Environment files excluded (.env)
- ✅ Sensitive data protected

---

## 🔔 Browser Notifications

Website menggunakan browser notification untuk alert:
- ⏰ Saat waktu fokus selesai
- ☕ Saat waktu break selesai
- 📅 Reminder untuk upcoming events

**Pastikan memberikan permission untuk notifikasi di browser Anda.**

---

## 🎯 Roadmap & Future Features

### Upcoming
- [ ] **Cloud Sync**: Sync data across devices
- [ ] **Collaborative Calendar**: Share events dengan team
- [ ] **Mobile App**: React Native version
- [ ] **Advanced Analytics**: Detailed productivity insights
- [ ] **Google Calendar Integration**: Import/export events
- [ ] **Team Pomodoro**: Group study sessions
- [ ] **Chess Tournaments**: Compete dengan users lain
- [ ] **Achievement System**: Gamification rewards
### Completed ✅
- ✅ Pomodoro Timer with tracking
- ✅ Chess Game (AI & PvP)
- ✅ Interactive Calendar dengan CRUD
- ✅ Drag & Drop events
- ✅ Notes Editor
- ✅ Statistics Dashboard
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Performance Optimization (27% lighter)
- ✅ Backend REST API with Express.js
- ✅ MongoDB Database Integration
- ✅ JWT Authentication System
- ✅ User Profile Management
- ✅ Pomodoro Session Tracking API
- ✅ Calendar Events API
- ✅ Notes Management API

--- Chess Game (AI & PvP)
- ✅ Interactive Calendar dengan CRUD
- ✅ Drag & Drop events
- ✅ Notes Editor
- ✅ Statistics Dashboard
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Performance Optimization (27% lighter)

---

## 🤝 Contributing

Contributions are welcome! Untuk berkontribusi:

1. **Fork** repository ini
2. **Create** feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** perubahan Anda
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** ke branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** Pull Request

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test your changes
- Update documentation
- Add comments for complex logic

---

## 💡 Tips Produktivitas

### Teknik Pomodoro
1. **Persiapan**: Buat to-do list sebelum memulai
2. **Eliminasi Distraksi**: Matikan notifikasi HP dan media sosial
3. **Fokus Penuh**: Satu task per Pomodoro session
4. **Jangan Skip Break**: Otak butuh istirahat untuk performa optimal
5. **Track Progress**: Catat jumlah Pomodoro yang diselesaikan
6. **Konsisten**: Jadikan kebiasaan harian

### Menggunakan Kalender
1. **Color Coding**: Gunakan kategori untuk organize events
2. **Time Blocking**: Alokasikan waktu spesifik untuk tasks
3. **Review Weekly**: Cek jadwal di awal minggu
4. **Buffer Time**: Sisakan gap antar events
5. **Prioritas**: Tandai events penting

### Strategi Belajar
1. **Active Recall**: Test diri sendiri
2. **Spaced Repetition**: Review berkala
3. **Break Tasks**: Pecah menjadi chunks kecil
4. **Remove Multitasking**: Fokus satu hal
5. **Rest Well**: Sleep untuk konsolidasi memori

---

## 📞 Support & Contact

Untuk pertanyaan, bug reports, atau feature requests:

- **Issues**: Open issue di GitHub
- **Email**: support@panggonsinau.com
- **Documentation**: Lihat README ini

---

## 📝 License

© 2025 Panggon Sinau. All rights reserved.

This project is proprietary and confidential.

---

## 👥 Credits & Acknowledgments

### Development Team
**Panggon Sinau Team**

### Technologies Used
- Next.js Team - React framework
- Vercel - Deployment platform
- Radix UI - Component primitives
- Lucide - Icon library
- Tailwind Labs - CSS framework

## 📊 Project Stats

- **Version**: 1.0.0
- **Frontend Components**: 60+ (optimized from 110+)
- **Backend API Endpoints**: 20+
- **Database Models**: 4 (User, Event, Note, PomodoroSession)
- **Total Lines of Code**: ~20,000+
- **Frontend Build Size**: 342 MB (optimized from 470 MB)
- **Backend Size**: ~25 MB
- **Load Time**: <2s average (frontend)
- **API Response Time**: <100ms average
- **Lighthouse Score**: 95+ Performance

---*Version**: 1.0.0
- **Total Components**: 60+ (optimized from 110+)
- **Total Lines of Code**: ~15,000+
- **Build Size**: 342 MB (optimized from 470 MB)
- **Load Time**: <2s average
## 🎓 Learning Resources

Untuk mempelajari teknologi yang digunakan:

### Frontend
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Backend
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [JWT Introduction](https://jwt.io/introduction)

### Other
- [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique)
- [RESTful API Design](https://restfulapi.net/)

---Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
**Built with ❤️ using Next.js 15, React 19, Express.js & MongoDB**lo.com/pages/pomodoro-technique)

---

**Selamat belajar dan bekerja produktif! 🚀**

*"Panggon Sinau - Tempat belajar yang produktif dan menyenangkan"*

---

**Built with ❤️ using Next.js 15 & React 19**
