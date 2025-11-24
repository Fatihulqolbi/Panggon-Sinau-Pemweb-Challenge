const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const PomodoroSession = require('../models/PomodoroSession');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's stats
    const todayPomodoros = await PomodoroSession.countDocuments({
      user: req.userId,
      type: 'focus',
      completedAt: { $gte: today }
    });

    const todayEvents = await Event.countDocuments({
      user: req.userId,
      year: today.getFullYear(),
      month: today.getMonth(),
      date: today.getDate()
    });

    // This week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weekPomodoros = await PomodoroSession.countDocuments({
      user: req.userId,
      type: 'focus',
      completedAt: { $gte: weekStart }
    });

    // Total counts
    const totalNotes = await Note.countDocuments({ user: req.userId });
    const totalEvents = await Event.countDocuments({ user: req.userId });

    // Recent activity
    const recentSessions = await PomodoroSession.find({
      user: req.userId
    })
      .sort({ completedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        today: {
          pomodoros: todayPomodoros,
          events: todayEvents
        },
        week: {
          pomodoros: weekPomodoros
        },
        total: {
          notes: totalNotes,
          events: totalEvents
        },
        recentActivity: recentSessions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/stats/productivity
// @desc    Get productivity trends
// @access  Private
router.get('/productivity', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const sessions = await PomodoroSession.find({
      user: req.userId,
      completedAt: { $gte: startDate }
    }).sort({ completedAt: 1 });

    // Group by date
    const dailyStats = {};
    
    sessions.forEach(session => {
      const date = session.completedAt.toISOString().split('T')[0];
      
      if (!dailyStats[date]) {
        dailyStats[date] = {
          focus: 0,
          break: 0,
          totalTime: 0
        };
      }
      
      if (session.type === 'focus') {
        dailyStats[date].focus++;
        dailyStats[date].totalTime += session.duration;
      } else {
        dailyStats[date].break++;
      }
    });

    res.json({
      success: true,
      days: parseInt(days),
      dailyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
