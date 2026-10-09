const express = require('express');
const { demoFeedback } = require('../utils/demoData');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ success: true, data: demoFeedback });
});

router.post('/', protect, (req, res) => {
  const { rating, feedback, suggestions = '' } = req.body || {};

  if (!rating || !feedback) {
    return res.status(400).json({ success: false, message: 'Rating and feedback are required' });
  }

  const newFeedback = {
    id: `f-${Date.now()}`,
    userId: req.user?.id || 'guest',
    userName: req.user?.name || 'Anonymous User',
    rating: Number(rating),
    feedback,
    suggestions,
    createdAt: new Date().toISOString(),
  };

  demoFeedback.unshift(newFeedback);
  return res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: newFeedback });
});

module.exports = router;
