const express = require('express');
const router = express.Router();
const PomodoroSession = require('../models/PomodoroSession');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/pomodoro
// @desc    Get all pomodoro sessions for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const query = { user: req.userId };
    
    if (type) query.type = type;
    
    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) query.completedAt.$gte = new Date(startDate);
      if (endDate) query.completedAt.$lte = new Date(endDate);
    }

    const sessions = await PomodoroSession.find(query).sort({ completedAt: -1 });
    
    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/pomodoro
// @desc    Log completed pomodoro session
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const session = new PomodoroSession({
      ...req.body,
      user: req.userId,
      completedAt: new Date()
    });

    await session.save();

    // Update user stats
    if (session.type === 'focus') {
      await User.findByIdAndUpdate(req.userId, {
        $inc: {
          'stats.totalPomodoros': 1,
          'stats.totalFocusTime': session.duration
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Pomodoro session logged successfully',
      session
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/pomodoro/stats
// @desc    Get pomodoro statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let startDate = new Date();
    
    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const sessions = await PomodoroSession.find({
      user: req.userId,
      completedAt: { $gte: startDate }
    });

    const stats = {
      totalSessions: sessions.length,
      focusSessions: sessions.filter(s => s.type === 'focus').length,
      breakSessions: sessions.filter(s => s.type === 'break').length,
      totalFocusTime: sessions
        .filter(s => s.type === 'focus')
        .reduce((sum, s) => sum + s.duration, 0),
      averageSessionLength: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
        : 0
    };

    res.json({
      success: true,
      period,
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
