const express = require('express');
const router = express.Router();
const {
  getTests,
  getTest,
  submitTest,
  getMyResults,
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getTests);
router.get('/my-results', protect, authorize('student'), getMyResults);
router.get('/:id', protect, getTest);
router.post('/:id/submit', protect, authorize('student'), submitTest);

module.exports = router;