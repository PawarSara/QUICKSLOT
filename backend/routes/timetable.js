const express = require("express");
const router = express.Router();
const Timetable = require("../models/timetable");

// Middleware placeholder for authentication
// Replace this with your actual auth middleware that sets req.user
const authMiddleware = (req, res, next) => {
  // Example: req.user = { id: "someUserIdFromToken" };
  // Remove/comment out this if you don't have auth yet
  next();
};

// POST - Add a new timetable
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { deadline, hoursPerDay, subjects } = req.body;

    // Validate required fields
    if (!deadline || !hoursPerDay || !subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Determine userId source: from req.user (auth) or from the request body
    const userIdFromAuth = req.user?.id; 

    // Validate and set userId for each subject
    const subjectsWithUserId = subjects.map((subj) => {
      // Use userId from auth if available, else fallback to subject userId
      const userId = userIdFromAuth || subj.userId;

      if (!userId || typeof userId !== "string" || userId.trim() === "") {
        throw new Error("Each subject must include a valid userId");
      }

      return {
        ...subj,
        userId,
      };
    });

    // Create and save timetable
    const newTimetable = new Timetable({
      deadline,
      hoursPerDay,
      subjects: subjectsWithUserId,
    });

    const savedTimetable = await newTimetable.save();

    res.status(201).json({
      message: "Timetable created successfully",
      timetable: savedTimetable,
    });
  } catch (error) {
    console.error("❌ Error creating timetable:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// GET - Retrieve all timetables (you can add filtering by userId if needed)
router.get("/", async (req, res) => {
  try {
    const timetables = await Timetable.find();
    res.status(200).json(timetables);
  } catch (error) {
    console.error("❌ Error fetching timetables:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
