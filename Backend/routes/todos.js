const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// @route   GET /api/todos
// @desc    Get all todos for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, category, priority, isCompleted, sortBy = '-createdAt' } = req.query;
    
    // Build filter
    const filter = { user: req.user.id };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === 'true';
    
    const todos = await Todo.find(filter)
      .sort(sortBy)
      .lean();
    
    res.json({
      success: true,
      count: todos.length,
      todos
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/todos/:id
// @desc    Get single todo by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      todo
    });
  } catch (error) {
    console.error('Get todo error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/todos
// @desc    Create new todo
// @access  Private
router.post(
  '/',
  [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('description').optional().trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('category').optional().isIn(['Work', 'Personal', 'Study', 'Health', 'Other']),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
    body('dueDate').optional().isISO8601().toDate()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    try {
      const {
        title,
        description,
        category,
        priority,
        status,
        dueDate,
        tags
      } = req.body;
      
      const todo = new Todo({
        user: req.user.id,
        title,
        description,
        category,
        priority,
        status,
        dueDate,
        tags
      });
      
      await todo.save();
      
      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        todo
      });
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private
router.put(
  '/:id',
  [
    auth,
    body('title').optional().trim().notEmpty()
      .isLength({ max: 200 }),
    body('description').optional().trim()
      .isLength({ max: 1000 }),
    body('category').optional().isIn(['Work', 'Personal', 'Study', 'Health', 'Other']),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
    body('dueDate').optional().isISO8601().toDate()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    try {
      const updateFields = {};
      const allowedFields = [
        'title',
        'description',
        'category',
        'priority',
        'status',
        'dueDate',
        'tags',
        'isCompleted',
        'order'
      ];
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateFields[field] = req.body[field];
        }
      });
      
      // If marking as completed, set completedAt
      if (updateFields.isCompleted === true) {
        updateFields.completedAt = new Date();
        updateFields.status = 'completed';
      } else if (updateFields.isCompleted === false) {
        updateFields.completedAt = null;
      }
      
      const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: updateFields },
        { new: true, runValidators: true }
      );
      
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Todo updated successfully',
        todo
      });
    } catch (error) {
      console.error('Update todo error:', error);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion status
// @access  Private
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    // Toggle completion
    if (todo.isCompleted) {
      await todo.markAsPending();
    } else {
      await todo.markAsCompleted();
    }
    
    res.json({
      success: true,
      message: `Todo marked as ${todo.isCompleted ? 'completed' : 'pending'}`,
      todo
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete todo (hard delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Todo deleted successfully',
      todo
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/todos
// @desc    Delete all completed todos
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const result = await Todo.deleteMany({
      user: req.user.id,
      isCompleted: true
    });
    
    res.json({
      success: true,
      message: `${result.deletedCount} completed todo(s) deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete completed todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/todos/stats/summary
// @desc    Get todo statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    
    const stats = {
      total: todos.length,
      completed: todos.filter(t => t.isCompleted).length,
      pending: todos.filter(t => !t.isCompleted && t.status === 'pending').length,
      inProgress: todos.filter(t => t.status === 'in-progress').length,
      overdue: todos.filter(t => !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date()).length,
      byCategory: {},
      byPriority: {}
    };
    
    // Group by category
    todos.forEach(todo => {
      if (!stats.byCategory[todo.category]) {
        stats.byCategory[todo.category] = 0;
      }
      stats.byCategory[todo.category]++;
    });
    
    // Group by priority
    todos.forEach(todo => {
      if (!stats.byPriority[todo.priority]) {
        stats.byPriority[todo.priority] = 0;
      }
      stats.byPriority[todo.priority]++;
    });
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get todo stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
