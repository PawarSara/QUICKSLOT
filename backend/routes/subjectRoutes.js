const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Subject = require("../models/subjectModel");

// POST - Add subjects
router.post("/add", async (req, res) => {
  try {
    const { year, semester, division, subjects } = req.body;

    // Validate required fields
    if (!year || !semester || !division || !subjects || subjects.length === 0) {
      return res.status(400).json({ error: "Year, semester, division, and subjects are required" });
    }

    // Format subjects
    const formattedSubjects = subjects.map(subj => ({
      name: subj.name,
      hoursPerWeek: Number(subj.hoursPerWeek) >= 0 ? Number(subj.hoursPerWeek) : 0
    }));

    // Generate a unique code for this record
    const uniqueCode = new mongoose.Types.ObjectId().toString();

    const newRecord = new Subject({
      year,
      semester: Number(semester),
      division,
      subjects: formattedSubjects,
      code: uniqueCode
    });

    await newRecord.save();
    res.status(201).json({ message: "✅ Data saved successfully!" });

  } catch (error) {
    console.error("❌ Error saving subject data:", error);
    res.status(500).json({ error: error.message });
  }

  console.log("📩 Received data:", req.body);
});

module.exports = router;
