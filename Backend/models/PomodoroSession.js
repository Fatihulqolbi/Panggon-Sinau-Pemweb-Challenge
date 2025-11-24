const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['focus', 'break', 'long-break'],
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  completedAt: {
    type: Date,
    required: true
  },
  taskName: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for stats queries
pomodoroSessionSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema);
