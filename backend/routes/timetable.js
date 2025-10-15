// routes/timetable.js
const express = require("express");
const router = express.Router();
const Faculty = require("../models/facultyModel");
const Subject = require("../models/subjectModel");
const Timetable = require("../models/timetableModel");
const FacultySchedule = require("../models/facultyScheduleModel");

// ------------------------------
// Constants
// ------------------------------
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slots = ["9:30-10:30", "10:30-11:30", "11:30-12:30", "1:00-2:00", "2:00-3:00"];
const divisions = ["A", "B"];

// ------------------------------
// Helper Functions
// ------------------------------
function isFacultyFree(facultyBusy, facultyName, day, slot) {
  return !(facultyBusy[facultyName]?.[day]?.includes(slot));
}

function markFacultyBusy(facultyBusy, facultyName, day, slot) {
  if (!facultyBusy[facultyName]) facultyBusy[facultyName] = {};
  if (!facultyBusy[facultyName][day]) facultyBusy[facultyName][day] = [];
  if (!facultyBusy[facultyName][day].includes(slot)) {
    facultyBusy[facultyName][day].push(slot);
  }
}

async function upsertFacultyScheduleSlot(semesterNum, facultyName, day, slot) {
  await FacultySchedule.findOneAndUpdate(
    { semester: semesterNum, facultyName },
    { $set: { [`schedule.${day}.${slot}`]: true } },
    { upsert: true, setDefaultsOnInsert: true }
  );
}

function findFacultyForSubject(faculties, subjName) {
  return faculties.find(f => Array.isArray(f.subjects) && f.subjects.includes(subjName));
}

function getFacultyNameField(fac) {
  return fac.facultyName || fac.name || null;
}

function createEmptyTimetable() {
  const t = {};
  for (const d of days) t[d] = {};
  return t;
}

function countSubjectInDay(timetable, day, subject) {
  let c = 0;
  for (const slot of slots) {
    if (timetable[day][slot]?.subject === subject) c++;
  }
  return c;
}

// ------------------------------
// Scheduler Function
// ------------------------------
async function scheduleAllDivisionsRoundRobin(subjects, faculties, semesterNum) {
  const facultyAssignments = {};
  for (const s of subjects) {
    const facDoc = findFacultyForSubject(faculties, s.name || s.subjectName);
    if (facDoc) facultyAssignments[s.name || s.subjectName] = getFacultyNameField(facDoc);
  }

  const facultyBusy = {};
  const results = [];

  for (const division of divisions) {
    const timetable = createEmptyTimetable();
    const remaining = {};

    for (const s of subjects)
      remaining[s.name || s.subjectName] = Number(s.hoursPerWeek) || 0;

    const subjNames = subjects.map(s => s.name || s.subjectName);
    let startIdx = 0;
    let progress = true;

    while (progress) {
      progress = false;
      for (let i = 0; i < subjNames.length; i++) {
        const subjName = subjNames[(startIdx + i) % subjNames.length];
        if ((remaining[subjName] || 0) <= 0) continue;
        const facName = facultyAssignments[subjName];
        if (!facName) continue;

        let placed = false;
        for (const day of days) {
          if (countSubjectInDay(timetable, day, subjName) >= 2) continue;
          for (const slot of slots) {
            if (remaining[subjName] <= 0) break;
            if (timetable[day][slot]) continue;
            if (!isFacultyFree(facultyBusy, facName, day, slot)) continue;

            timetable[day][slot] = { subject: subjName, faculty: facName };
            markFacultyBusy(facultyBusy, facName, day, slot);

            try {
              await upsertFacultyScheduleSlot(semesterNum, facName, day, slot);
            } catch (err) {
              console.error("Error upserting FacultySchedule:", err);
            }

            remaining[subjName]--;
            placed = true;
            progress = true;
            break;
          }
          if (placed) break;
        }
      }
      startIdx = (startIdx + 1) % Math.max(1, subjNames.length);
    }

    const unassigned = [];
    for (const s of subjects) {
      const subjName = s.name || s.subjectName;
      if ((remaining[subjName] || 0) > 0) {
        unassigned.push({ subject: subjName, remaining: remaining[subjName] });
      }
    }

    // Fill empty slots with Off
    for (const day of days) {
      for (const slot of slots) {
        if (!timetable[day][slot])
          timetable[day][slot] = { subject: "Off", faculty: "-" };
      }
    }

    results.push({ division, timetable, unassigned });
  }

  return results;
}

// ------------------------------
// Routes
// ------------------------------

// Generate All Divisions
router.get("/generateAll", async (req, res) => {
  try {
    const { year, semester } = req.query;
    if (!year || !semester) return res.status(400).json({ error: "year and semester required" });
    const semesterNum = Number(semester);

    const subjects = await Subject.find({ year, semester: semesterNum });
    const faculties = await Faculty.find();

    if (!subjects?.length) return res.json([]);
    if (!faculties?.length) return res.json([]);

    await FacultySchedule.deleteMany({ semester: semesterNum });

    const results = await scheduleAllDivisionsRoundRobin(subjects, faculties, semesterNum);

    const docs = results.map(r => ({
      year,
      semester: semesterNum,
      division: r.division,
      timetable: r.timetable,
    }));

    await Timetable.deleteMany({ year, semester: semesterNum });
    const inserted = await Timetable.insertMany(docs);

    const unassigned = {};
    results.forEach(r => {
      if (r.unassigned.length) unassigned[r.division] = r.unassigned;
    });

    return res.json({
      message: `Timetables generated for semester ${semesterNum}`,
      generatedFor: divisions,
      insertedCount: inserted.length,
      unassigned,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// Get Single Division
router.get("/generate", async (req, res) => {
  try {
    const { semester, division } = req.query;
    if (!semester || !division) return res.status(400).json({ error: "semester and division required" });
    const t = await Timetable.findOne({ semester: Number(semester), division });
    return res.json(t || { timetable: {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// Delete Timetable
router.delete("/delete", async (req, res) => {
  try {
    const { semester, division } = req.query;
    if (!semester || !division) return res.status(400).json({ error: "semester and division required" });
    await Timetable.deleteOne({ semester: Number(semester), division });
    res.json({ message: "✅ Timetable deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// Update Whole Timetable
router.patch("/update", async (req, res) => {
  try {
    const { semester, division, timetable } = req.body;
    if (!semester || !division || !timetable) return res.status(400).json({ error: "semester, division, timetable required" });
    const updated = await Timetable.findOneAndUpdate(
      { semester: Number(semester), division },
      { $set: { timetable } },
      { new: true, upsert: true }
    );
    res.json({ message: "✅ Timetable updated", timetable: updated.timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// Update single slot
router.patch("/updateSlot", async (req, res) => {
  try {
    const { semester, division, day, slot, subject, faculty } = req.body;
    if (!semester || !division || !day || !slot) return res.status(400).json({ error: "Missing required fields" });

    const updateQuery = {};
    updateQuery[`timetable.${day}.${slot}`] = { subject, faculty };

    const updated = await Timetable.findOneAndUpdate(
      { semester: Number(semester), division },
      { $set: updateQuery },
      { new: true, upsert: true }
    );

    res.json({ message: "Slot updated successfully", timetable: updated.timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update slot" });
  }
});

// Check Faculty Clash
router.post("/checkFacultyClash", async (req, res) => {
  try {
    const { facultyName, day, slot } = req.body;
    if (!facultyName || !day || !slot) return res.status(400).json({ error: "facultyName, day, slot required" });

    const timetables = await Timetable.find();
    for (const t of timetables) {
      const lecture = t.timetable?.[day]?.[slot];
      if (lecture?.faculty === facultyName) {
        return res.json({ clash: true, clashInfo: { year: t.year, semester: t.semester, division: t.division, day, slot } });
      }
    }
    res.json({ clash: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
