const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['my-calendar', 'work', 'personal', 'family', 'My Calendar', 'Work', 'Personal', 'Family'],
    default: 'my-calendar'
  },
  color: {
    type: String,
    default: 'bg-blue-500'
  },
  location: {
    type: String,
    trim: true
  },
  attendees: [{
    type: String
  }],
  organizer: {
    type: String,
    default: 'You'
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ user: 1, year: 1, month: 1 });

module.exports = mongoose.model('Event', eventSchema);
