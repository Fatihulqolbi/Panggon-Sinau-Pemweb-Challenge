const express = require('express');
const router = express.Router();
const multer = require('multer');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @route   GET /api/notes
// @desc    Get all notes for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, search, archived } = req.query;
    
    const query = { user: req.userId };
    
    if (category) query.category = category;
    if (archived !== undefined) query.isArchived = archived === 'true';
    
    let notes;
    
    if (search) {
      notes = await Note.find({
        ...query,
        $text: { $search: search }
      }).sort({ isPinned: -1, updatedAt: -1 });
    } else {
      notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    }
    
    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const noteData = {
      ...req.body,
      user: req.userId
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      noteData.images = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname
      }));
    }

    const note = new Note(noteData);
    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname
      }));
      
      // If keepExisting is true, append to existing images, otherwise replace
      if (req.body.keepExistingImages === 'true') {
        updateData.images = [...(note.images || []), ...newImages];
      } else {
        updateData.images = newImages;
      }
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/notes/:id/images/:imageIndex
// @desc    Get note image
// @access  Private
router.get('/:id/images/:imageIndex', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Verify token
    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.user.toString() !== decoded.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    if (!note.images || !note.images[imageIndex]) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const image = note.images[imageIndex];
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error('Image loading error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
