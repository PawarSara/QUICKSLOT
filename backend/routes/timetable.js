const express = require("express");
const router = express.Router();
const Faculty = require("../models/facultyModel");
const Subject = require("../models/subjectModel");
const Timetable = require("../models/timetableModel");
const FacultySchedule = require("../models/facultyScheduleModel");

const slots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "1:00-2:00", "2:00-3:00"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const initTimetable = () => {
  const table = {};
  weekdays.forEach(day => {
    table[day] = {};
    slots.forEach(slot => (table[day][slot] = null));
  });
  return table;
};

router.get("/generate", async (req, res) => {
  try {
    const { semester, division } = req.query;
    if (!semester || !division) {
      return res.status(400).json({ message: "Semester and Division are required" });
    }

    // ✅ 1. Check if timetable already exists
    const existingTimetable = await Timetable.findOne({ semester, division });
    if (existingTimetable) {
      return res.json({
        message: "✅ Timetable already exists. Showing saved version.",
        timetable: existingTimetable.timetable,
        fixed: true,
      });
    }

    // ✅ 2. Fetch subjects and faculties
    const subjectsData = await Subject.find({ semester, division });
    const faculties = await Faculty.find();
    if (!subjectsData.length) {
      return res.status(404).json({ message: "No subjects found for this semester/division" });
    }

    const timetable = initTimetable();

    // Local tracking (for current division)
    const facultyBusy = {};
    weekdays.forEach(day => {
      facultyBusy[day] = {};
      slots.forEach(slot => (facultyBusy[day][slot] = false));
    });

    // ✅ Load existing global faculty schedules
    const globalSchedules = await FacultySchedule.find({ semester });
    const globalBusy = {}; // { faculty: { day: { slot: true/false } } }

    globalSchedules.forEach(record => {
      const faculty = record.facultyName;
      globalBusy[faculty] = record.schedule;
    });

    // ✅ Prepare lecture list
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

    const subjectPerDayCount = {};
    weekdays.forEach(day => (subjectPerDayCount[day] = {}));

    // ✅ Assign lectures
    for (const lecture of lectures) {
      let tries = 0;

      while (lecture.assigned < lecture.hours && tries < 200) {
        const { day, slot } = allSlots[Math.floor(Math.random() * allSlots.length)];
        tries++;

        const faculty = lecture.faculty;

        // Local + Global Clash Check
        const isLocalBusy = facultyBusy[day][slot];
        const isGlobalBusy = globalBusy[faculty]?.[day]?.[slot];

        if (timetable[day][slot]) continue;
        if (isLocalBusy || isGlobalBusy) continue;
        if ((subjectPerDayCount[day][lecture.subject] || 0) >= 2) continue;

        // ✅ Assign lecture
        timetable[day][slot] = {
          subject: lecture.subject,
          faculty,
        };

        // Update local busy map
        facultyBusy[day][slot] = true;
        subjectPerDayCount[day][lecture.subject] =
          (subjectPerDayCount[day][lecture.subject] || 0) + 1;
        lecture.assigned++;

        // ✅ Update global busy map in DB
        let facultyRecord = await FacultySchedule.findOne({ semester, facultyName: faculty });
        if (!facultyRecord) {
          facultyRecord = new FacultySchedule({
            semester,
            facultyName: faculty,
            schedule: {},
          });
        }

        if (!facultyRecord.schedule[day]) facultyRecord.schedule[day] = {};
        facultyRecord.schedule[day][slot] = true;
        await facultyRecord.save();
      }
    }

    // ✅ 3. Save final timetable
    const newTimetable = new Timetable({ semester, division, timetable });
    await newTimetable.save();

    res.json({
      message: "✅ Global clash-free timetable generated successfully.",
      timetable,
      fixed: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating timetable" });
  }
});

module.exports = router;
