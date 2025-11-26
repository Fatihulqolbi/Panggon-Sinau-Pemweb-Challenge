const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  photoUrl: {
    type: String // Alternative: Store external URL if not using Buffer
  }
}, {
  timestamps: true
});

// Index for faster queries
quoteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Quote', quoteSchema);
