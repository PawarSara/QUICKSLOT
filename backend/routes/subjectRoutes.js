// backend/routes/subjectRoutes.js
const express = require("express");
const router = express.Router();
const Subject = require("../models/subjectModel");

// POST - save subject data
router.post("/add", async (req, res) => {
  try {
    const { semester, subjects } = req.body;
    const newRecord = new Subject({ semester, subjects });
    await newRecord.save();
    res.status(201).json({ message: "✅ Data saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error saving data", error });
  }
});

// GET - view all subjects (optional for testing)
router.get("/", async (req, res) => {
  try {
    const data = await Subject.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching data", error });
  }
});

module.exports = router;
