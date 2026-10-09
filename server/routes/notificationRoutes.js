const express = require('express');
const { demoNotifications } = require('../utils/demoData');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, (req, res) => {
  const notifications = demoNotifications.filter((item) => item.userId === req.user.id || item.userId === 'all');
  return res.status(200).json({ success: true, data: notifications });
});

router.patch('/:id/read', protect, (req, res) => {
  const item = demoNotifications.find((notification) => notification.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  item.read = true;
  return res.status(200).json({ success: true, message: 'Notification marked as read', data: item });
});

module.exports = router;
