const express = require("express");
const router = express.Router();
const Timetable = require("../models/timetable");
const Subject = require("../models/subject");
const Faculty = require("../models/faculty");

// ------------------ Create Timetable ------------------
router.post("/add", async (req, res) => {
  try {
    const { year, division, slots } = req.body;
    const timetable = new Timetable({ year, division, slots });
    await timetable.save();
    res.status(201).json({ message: "Timetable created", timetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Get All Timetables ------------------
router.get("/", async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate("slots.$*.subject")
      .populate("slots.$*.faculty");
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Get Timetable by Year & Division ------------------
router.get("/:year/:division", async (req, res) => {
  try {
    const { year, division } = req.params;
    const query = { year };
    if (division) query.division = division;

    const timetable = await Timetable.findOne(query)
      .populate("slots.$*.subject")
      .populate("slots.$*.faculty");

    if (!timetable) return res.status(404).json({ message: "Timetable not found" });

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Update Timetable ------------------
router.put("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("slots.$*.subject")
      .populate("slots.$*.faculty");

    if (!timetable) return res.status(404).json({ message: "Timetable not found" });

    res.json({ message: "Timetable updated", timetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Delete Timetable ------------------
router.delete("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) return res.status(404).json({ message: "Timetable not found" });

    res.json({ message: "Timetable deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
