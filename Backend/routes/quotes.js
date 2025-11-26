const express = require('express');
const router = express.Router();
const multer = require('multer');
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @route   GET /api/quotes
// @desc    Get all quotes for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.user.id })
      .select('-photo.data') // Exclude photo data from list
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: quotes.length,
      quotes
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/quotes/:id
// @desc    Get single quote by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({
      success: true,
      quote
    });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/quotes/:id/photo
// @desc    Get quote photo
// @access  Private
router.get('/:id/photo', auth, async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!quote || !quote.photo || !quote.photo.data) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    res.set('Content-Type', quote.photo.contentType);
    res.send(quote.photo.data);
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/quotes
// @desc    Create new quote
// @access  Private
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({
        success: false,
        message: 'Text and author are required'
      });
    }

    const quoteData = {
      user: req.user.id,
      text,
      author
    };

    // Add photo if uploaded
    if (req.file) {
      quoteData.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const quote = new Quote(quoteData);
    await quote.save();

    // Return quote without photo data
    const quoteResponse = quote.toObject();
    if (quoteResponse.photo) {
      delete quoteResponse.photo.data;
    }

    res.status(201).json({
      success: true,
      message: 'Quote created successfully',
      quote: quoteResponse
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/quotes/:id
// @desc    Update quote
// @access  Private
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { text, author } = req.body;

    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    // Update fields
    if (text) quote.text = text;
    if (author) quote.author = author;

    // Update photo if uploaded
    if (req.file) {
      quote.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await quote.save();

    // Return quote without photo data
    const quoteResponse = quote.toObject();
    if (quoteResponse.photo) {
      delete quoteResponse.photo.data;
    }

    res.json({
      success: true,
      message: 'Quote updated successfully',
      quote: quoteResponse
    });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/quotes/:id
// @desc    Delete quote
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const quote = await Quote.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    res.json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
