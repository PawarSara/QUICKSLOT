// backend/routes/subjectRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Subject = require("../models/subjectModel");

// ✅ Add new subjects
router.post("/add", async (req, res) => {
  try {
    console.log("📩 Received data:", req.body);

    const { year, semester, subjects } = req.body;

    if (!year || !semester || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    // Delete old subjects for same semester before inserting new
    await Subject.deleteMany({ semester });

    // Insert new subjects
    await Subject.insertMany(subjects.map(sub => ({
      year,
      semester,
      subjectName: sub.name,
      hoursPerWeek: sub.hoursPerWeek
    })));

    console.log("✅ Subjects added successfully for semester:", semester);

    // ✅ Automatically generate timetable right after saving subjects
    try {
      const response = await axios.get(`http://localhost:5000/api/timetable/generateAll`, {
        params: { year, semester }
      });

      console.log("🗓️ Timetable generation triggered automatically.");
      console.log("🔹 Response:", response.data);

    } catch (timetableError) {
      console.error("⚠️ Timetable generation failed:", timetableError.message);
    }

    res.status(201).json({ message: "✅ Subjects saved and timetable generated automatically!" });

  } catch (error) {
    console.error("❌ Error adding subjects:", error);
    res.status(500).json({ message: "Server error while adding subjects." });
  }
});

// ✅ Get all subjects
router.get("/all", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects." });
  }
});

// ✅ Delete subjects by semester
router.delete("/:semester", async (req, res) => {
  try {
    const { semester } = req.params;
    await Subject.deleteMany({ semester });
    res.json({ message: `Subjects for semester ${semester} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting subjects:", error);
    res.status(500).json({ message: "Server error while deleting subjects." });
  }
});

module.exports = router;
