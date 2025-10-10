// backend/routes/timetable.js
const express = require("express");
const router = express.Router();
const Faculty = require("../models/facultyModel");
const Subject = require("../models/subjectModel");

const slots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "1:00-2:00", "2:00-3:00"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Helper: initialize empty timetable
const initTimetable = () => {
  const table = {};
  weekdays.forEach(day => {
    table[day] = {};
    slots.forEach(slot => {
      table[day][slot] = null;
    });
  });
  return table;
};

router.get("/generate", async (req, res) => {
  try {
    const subjectsData = await Subject.find();
    const faculties = await Faculty.find();

    const timetable = initTimetable();

    // Prepare lectures with remaining hours
    let lectures = [];
    subjectsData.forEach(subjRecord => {
      subjRecord.subjects.forEach(subj => {
        const faculty = faculties.find(f => f.subjects.includes(subj.name));
        if (faculty) {
          lectures.push({
            subject: subj.name,
            faculty: faculty.facultyName,
            remaining: subj.hoursPerWeek
          });
        }
      });
    });

    // Sort lectures by hours descending (more hours scheduled first)
    lectures.sort((a, b) => b.remaining - a.remaining);

    // Calculate total slots per week
    const totalSlots = weekdays.length * slots.length;

    // Step 1: Create a list of all slot positions
    let allSlots = [];
    weekdays.forEach(day => {
      slots.forEach(slot => {
        allSlots.push({ day, slot });
      });
    });

    // Step 2: Distribute lectures evenly across slots
    lectures.forEach(lecture => {
      const step = Math.floor(allSlots.length / lecture.remaining) || 1; // spacing
      let index = 0;

      for (let i = 0; i < lecture.remaining; i++) {
        // Find next available slot
        while (index < allSlots.length && timetable[allSlots[index].day][allSlots[index].slot]) {
          index++;
        }
        if (index >= allSlots.length) {
          // If overflow, place in any empty slot
          const emptySlot = allSlots.find(s => !timetable[s.day][s.slot]);
          if (emptySlot) {
            timetable[emptySlot.day][emptySlot.slot] = {
              subject: lecture.subject,
              faculty: lecture.faculty
            };
          }
          continue;
        }

        const { day, slot } = allSlots[index];
        timetable[day][slot] = {
          subject: lecture.subject,
          faculty: lecture.faculty
        };
        index += step;
      }
    });

    res.json({ timetable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating timetable" });
  }
});

module.exports = router;
