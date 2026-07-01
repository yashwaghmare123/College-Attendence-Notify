const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['A', 'B']
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: true
  },
  displayName: {
    type: String,
    required: true,
    default: function() { 
      return `${this.name} Division`; 
    }
  },
  capacity: {
    type: Number,
    default: 60
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

// Compound index to ensure unique division per year
divisionSchema.index({ name: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Division', divisionSchema);
