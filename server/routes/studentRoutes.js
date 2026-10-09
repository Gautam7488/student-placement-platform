const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/skills', addSkill);
router.put('/skills/:skillId', updateSkill);
router.delete('/skills/:skillId', deleteSkill);

module.exports = router;