# 🏥 Smart Healthcare Appointment System

A full-stack, feature-rich healthcare appointment management platform built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring a **Sky Blue** modern UI theme.

---

## ✨ Features

### 👤 Patient Features
- Register/Login with role-based access
- Browse and search doctors by specialization, city, rating, fee
- View doctor profiles with availability, qualifications, and reviews
- Book **in-person** or **telemedicine (video)** appointments
- Real-time available slot selection
- Emergency appointment booking
- View and cancel appointments
- Leave ratings & reviews for doctors
- Manage **medical records** (prescriptions, lab reports, scans)
- **AI Symptom Checker** — analyze symptoms and get specialist recommendations
- Secure **messaging** with doctors

### 👨‍⚕️ Doctor Features
- Register with professional information
- Manage availability schedule (days, time slots, slot duration)
- View and manage today's / all appointments
- Confirm, complete, or cancel appointments
- Write prescriptions for completed appointments
- Enable/disable telemedicine
- Profile management
- Messaging with patients

### 🛠️ Admin Features
- Full dashboard with analytics and charts
- Monthly appointment trends chart (Recharts)
- Approve/reject doctor registrations
- Manage all users
- View all appointments with status filters
- Revenue tracking

### 🆕 Advanced Features
- **AI Symptom Checker** (rule-based engine with 12+ symptoms)
- **Telemedicine** video call link generation
- **Real-time slot availability**
- **Health News Feed**
- **Secure messaging** system
- **Medical Records** management
- Emergency appointment flagging
- Role-based protected routing
- JWT authentication with refresh

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| UI | Custom CSS, Sky Blue Theme, React Icons |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Notifications | React Toastify |

---

## 📁 Project Structure

```
Smart Healthcare Appointment System/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── reviewController.js
│   │   ├── adminController.js
│   │   ├── symptomController.js
│   │   ├── messageController.js
│   │   └── newsController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Review.js
│   │   ├── Message.js
│   │   └── MedicalRecord.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── symptomRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── patientRoutes.js
│   │   └── newsRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       ├── Navbar.js
    │   │       ├── Navbar.css
    │   │       └── Footer.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js + Home.css
    │   │   ├── Doctors.js
    │   │   ├── DoctorDetail.js
    │   │   ├── SymptomChecker.js
    │   │   ├── HealthNews.js
    │   │   ├── About.js
    │   │   ├── Messages.js
    │   │   ├── Profile.js
    │   │   ├── auth/
    │   │   │   ├── Login.js
    │   │   │   └── Register.js
    │   │   ├── patient/
    │   │   │   ├── Dashboard.js
    │   │   │   ├── BookAppointment.js
    │   │   │   ├── MyAppointments.js
    │   │   │   └── MedicalRecords.js
    │   │   ├── doctor/
    │   │   │   ├── Dashboard.js
    │   │   │   ├── Appointments.js
    │   │   │   └── Profile.js
    │   │   └── admin/
    │   │       ├── Dashboard.js
    │   │       ├── Doctors.js
    │   │       ├── Users.js
    │   │       └── Appointments.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1. Clone & Setup Backend

```bash
cd backend
npm install
```

Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/smart_healthcare
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Create Admin User

After starting the backend, create an admin user directly in MongoDB:
```js
// In MongoDB shell or Compass
db.users.insertOne({
  name: "Admin",
  email: "admin@demo.com",
  password: "$2a$12...", // bcrypt hash of "demo123"
  role: "admin"
})
```

Or use the seed script:
```bash
cd backend
node seed.js
```

### 4. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🎨 Color Theme

| Variable | Value | Usage |
|----------|-------|-------|
| `--sky-500` | `#0ea5e9` | Primary buttons, accents |
| `--sky-600` | `#0284c7` | Hover states, links |
| `--sky-700` | `#0369a1` | Text, dark elements |
| `--sky-50` | `#f0f9ff` | Background tints |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/doctors` | Get all doctors (with filters) |
| GET | `/api/doctors/:id` | Get doctor by ID |
| GET | `/api/appointments/slots` | Get available slots |
| POST | `/api/appointments/book` | Book appointment |
| POST | `/api/symptoms/check` | AI symptom check |
| GET | `/api/news` | Health news |
| GET | `/api/admin/dashboard` | Admin stats |

---

## 📝 License
MIT License — Free to use and modify.
