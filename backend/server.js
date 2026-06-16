const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: require("os").tmpdir() }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/symptoms", require("./routes/symptomRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Smart Healthcare API is running", status: "OK" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
