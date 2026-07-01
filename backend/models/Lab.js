const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 30
  },
  type: {
    type: String,
    enum: ['Regular', 'ML Lab', 'Special'],
    default: 'Regular'
  },
  systems: {
    type: Number,
    default: 30
  },
  software: {
    type: [String],
    default: ['Python', 'Java', 'SQL']
  },
  building: {
    type: String,
    default: 'Main'
  },
  floor: {
    type: Number,
    default: 2
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maintenanceSchedule: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lab', labSchema);
