const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Study', 'Health', 'Other'],
    default: 'Personal'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index untuk performance
todoSchema.index({ user: 1, createdAt: -1 });
todoSchema.index({ user: 1, isCompleted: 1 });
todoSchema.index({ user: 1, dueDate: 1 });

// Method untuk mark as completed
todoSchema.methods.markAsCompleted = function() {
  this.isCompleted = true;
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method untuk mark as pending
todoSchema.methods.markAsPending = function() {
  this.isCompleted = false;
  this.status = 'pending';
  this.completedAt = null;
  return this.save();
};

module.exports = mongoose.model('Todo', todoSchema);
