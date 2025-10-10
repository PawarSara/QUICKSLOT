// backend/routes/faculty.js
const express = require("express");
const router = express.Router();
const Faculty = require("../models/facultyModel");

// Add new faculty
router.post("/add", async (req, res) => {
  try {
    const { facultyName, subjects } = req.body;

    if (!facultyName || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const newFaculty = new Faculty({ facultyName, subjects });
    await newFaculty.save();

    res.status(201).json({ message: "Faculty added successfully!" });
  } catch (error) {
    console.error("Error adding faculty:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all faculties
router.get("/all", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculties" });
  }
});

module.exports = router;
