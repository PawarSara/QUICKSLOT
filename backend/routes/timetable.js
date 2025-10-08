// routes/timetable.js
const express = require("express");
const router = express.Router();
const Timetable = require("../models/timetable");

// Create new timetable
router.post("/create", async (req, res) => {
  try {
    const { year, division, semester, subjects } = req.body;

    // Validation
    if (!year || !division || !semester || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTT = new Timetable({
      year,
      division,
      semester,
      subjects,
    });

    await newTT.save();
    res.status(201).json({ message: "Timetable created successfully", timetable: newTT });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
