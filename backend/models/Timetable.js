const mongoose = require('mongoose');

const timetableEntrySchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  },
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab'
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  type: {
    type: String,
    enum: ['Lecture', 'Practical'],
    default: 'Lecture'
  },
  room: String,
  notes: String
});

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: true
  },
  semester: {
    type: Number,
    enum: [1, 2],
    default: 1
  },
  academicYear: {
    type: String,
    required: true,
    default: function() {
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${currentYear + 1}`;
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  entries: [timetableEntrySchema],
  conflictLog: [{
    type: String,
    date: Date
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  generationAlgorithm: {
    type: String,
    default: 'Constraint Satisfaction with Priority Queue'
  },
  metadata: {
    totalSlots: Number,
    totalTeachers: Number,
    totalSubjects: Number,
    totalDivisions: Number,
    generationTime: Number // in milliseconds
  }
});

module.exports = mongoose.model('Timetable', timetableSchema);
