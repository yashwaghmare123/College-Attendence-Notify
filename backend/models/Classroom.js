const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  },
  facilities: {
    type: [String],
    enum: ['Projector', 'Whiteboard', 'Smart Board', 'AC', 'WiFi'],
    default: ['Projector', 'Whiteboard', 'AC', 'WiFi']
  },
  building: {
    type: String,
    default: 'Main'
  },
  floor: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Classroom', classroomSchema);
