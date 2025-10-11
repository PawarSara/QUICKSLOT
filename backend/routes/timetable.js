const express = require("express");
const router = express.Router();
const Faculty = require("../models/facultyModel");
const Subject = require("../models/subjectModel");
const Timetable = require("../models/timetableModel");

const slots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "1:00-2:00", "2:00-3:00"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Initialize timetable structure
const initTimetable = () => {
  const table = {};
  weekdays.forEach(day => {
    table[day] = {};
    slots.forEach(slot => (table[day][slot] = null));
  });
  return table;
};

// Helper: Shuffle array randomly
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

router.get("/generate", async (req, res) => {
  try {
    const { semester, division } = req.query;
    if (!semester || !division) {
      return res.status(400).json({ message: "Semester and Division are required" });
    }

    // ✅ Step 1: Check if timetable already exists
    const existingTimetable = await Timetable.findOne({ semester, division });
    if (existingTimetable) {
      return res.json({
        message: "✅ Timetable already exists. Showing saved version.",
        timetable: existingTimetable.timetable,
        fixed: true,
      });
    }

    // ✅ Step 2: Fetch data for generation
    const subjectsData = await Subject.find({ semester, division });
    const faculties = await Faculty.find();
    if (!subjectsData.length) {
      return res.status(404).json({ message: "No subjects found for this semester/division" });
    }

    const timetable = initTimetable();

    const facultyBusy = {};
    weekdays.forEach(day => {
      facultyBusy[day] = {};
      slots.forEach(slot => (facultyBusy[day][slot] = false));
    });

    let lectures = [];
    subjectsData.forEach(record => {
      record.subjects.forEach(subj => {
        const faculty = faculties.find(f => f.subjects.includes(subj.name));
        if (faculty) {
          lectures.push({
            subject: subj.name,
            faculty: faculty.facultyName,
            hours: subj.hoursPerWeek,
            assigned: 0
          });
        }
      });
    });

    lectures.sort((a, b) => b.hours - a.hours);

    const allSlots = [];
    weekdays.forEach(day => {
      slots.forEach(slot => allSlots.push({ day, slot }));
    });
    shuffle(allSlots);

    const subjectPerDayCount = {};
    weekdays.forEach(day => (subjectPerDayCount[day] = {}));

    for (const lecture of lectures) {
      let tries = 0;

      while (lecture.assigned < lecture.hours && tries < 200) {
        const { day, slot } = allSlots[Math.floor(Math.random() * allSlots.length)];
        tries++;

        if (timetable[day][slot]) continue;
        if (facultyBusy[day][slot]) continue;
        if ((subjectPerDayCount[day][lecture.subject] || 0) >= 2) continue;

        timetable[day][slot] = {
          subject: lecture.subject,
          faculty: lecture.faculty,
        };
        facultyBusy[day][slot] = true;
        subjectPerDayCount[day][lecture.subject] = (subjectPerDayCount[day][lecture.subject] || 0) + 1;
        lecture.assigned++;
      }
    }

    // ✅ Step 3: Save timetable permanently
    const newTimetable = new Timetable({
      semester,
      division,
      timetable,
    });
    await newTimetable.save();

    res.json({
      message: "✅ Timetable generated and saved successfully.",
      timetable,
      fixed: false,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating timetable" });
  }
});

module.exports = router;
