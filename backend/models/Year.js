const mongoose = require('mongoose');

const yearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['SY', 'TY', 'Final Year'],
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    default: function() { return this.name; }
  },
  yearNumber: {
    type: Number,
    required: true,
    enum: [2, 3, 4]
  },
  startTime: {
    type: String,
    required: true,
    default: '09:00' // HH:MM format
  },
  endTime: {
    type: String,
    required: true,
    default: '16:00' // HH:MM format
  },
  breakStartTime: {
    type: String,
    required: true,
    default: '12:00'
  },
  breakEndTime: {
    type: String,
    required: true,
    default: '13:00'
  },
  lectureHours: {
    type: Number,
    required: true,
    default: 1 // in hours
  },
  practicalHours: {
    type: Number,
    required: true,
    default: 2 // in hours
  },
  workingDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Year', yearSchema);
