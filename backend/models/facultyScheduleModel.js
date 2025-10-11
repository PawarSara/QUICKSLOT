const mongoose = require("mongoose");

const facultyScheduleSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  facultyName: { type: String, required: true },
  schedule: {
    Monday: { type: Object, default: {} },
    Tuesday: { type: Object, default: {} },
    Wednesday: { type: Object, default: {} },
    Thursday: { type: Object, default: {} },
    Friday: { type: Object, default: {} },
  },
});

module.exports = mongoose.model("FacultySchedule", facultyScheduleSchema);
