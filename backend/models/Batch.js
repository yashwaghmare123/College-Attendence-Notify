const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  batchNumber: {
    type: String,
    required: true,
    enum: ['A1', 'B1', 'A2', 'B2', 'A3', 'B3', 'A4', 'B4']
  },
  students: {
    type: Number,
    default: 15
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  labAssistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  assignedLab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab'
  },
  labType: {
    type: String,
    enum: ['Regular', 'ML Lab', 'Special'],
    default: 'Regular'
  },
  practicalDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    default: []
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

// Compound index for unique batch per division per subject
batchSchema.index({ division: 1, subject: 1, batchNumber: 1 }, { unique: true });

module.exports = mongoose.model('Batch', batchSchema);
