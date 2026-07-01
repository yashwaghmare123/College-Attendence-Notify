const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: true
  },
  credits: {
    type: Number,
    default: 4
  },
  lecturesPerWeek: {
    type: Number,
    required: true,
    default: 3
  },
  practicalsPerWeek: {
    type: Number,
    required: true,
    default: 0
  },
  requiresLab: {
    type: Boolean,
    default: false
  },
  labType: {
    type: String,
    enum: ['Regular', 'ML Lab', 'Other'],
    default: 'Regular'
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  divisions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  }],
  color: {
    type: String,
    default: '#3B82F6' // Tailwind blue-500
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

module.exports = mongoose.model('Subject', subjectSchema);
