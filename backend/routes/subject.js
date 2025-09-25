const express = require("express");
const router = express.Router();
const Subject = require("../models/subject");

// ➕ Add Subject
router.post("/add", async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ message: "Subject added", subject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📃 Get All Subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().populate("faculty"); // populate faculty details
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
