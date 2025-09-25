const express = require("express");
const router = express.Router();
const Faculty = require("../models/faculty");

// ➕ Add Faculty
router.post("/add", async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json({ message: "Faculty added", faculty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📃 Get All Faculties
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
