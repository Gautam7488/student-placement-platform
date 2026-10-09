const express = require('express');
const { listSkills, createSkill } = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', listSkills);
router.post('/', protect, authorize('admin', 'recruiter'), createSkill);

module.exports = router;
