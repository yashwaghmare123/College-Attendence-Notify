const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    required: true,
    default: 'Computer Science'
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  divisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  }],
  maxHoursPerWeek: {
    type: Number,
    default: 20
  },
  unavailableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: []
  },
  unavailableTimeSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  isLabAssistant: {
    type: Boolean,
    default: false
  },
  assignedLabs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);
