const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  faculty_email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  faculty_name: {
    type: String,
    required: true
  },
  total_students: {
    type: Number,
    required: true
  },
  emails_sent: {
    type: Number,
    required: true
  },
  emails_failed: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
