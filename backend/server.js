// ------------------ Imports ------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// ------------------ App Initialization ------------------
const app = express();

// ------------------ Middleware ------------------
app.use(cors());
app.use(express.json());

// ------------------ Import Routes ------------------
const authRoutes = require("./routes/auth");          // Admin login
const facultyRoutes = require("./routes/faculty");    // Faculty management
const subjectRoutes = require("./routes/subject");    // Subject management
const timetableRoutes = require("./routes/timetable");// Timetable CRUD

// ------------------ API Routes ------------------
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/timetable", timetableRoutes);

// ------------------ Default Route ------------------
app.get("/", (req, res) => {
  res.send("✅ Server is running. Welcome to Department Timetable Generator!");
});

// ------------------ MongoDB Connection ------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL); // ✅ removed deprecated options
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
