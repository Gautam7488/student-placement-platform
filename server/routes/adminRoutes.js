const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  createTest,
  updateTest,
  deleteTest,
  addQuestion,
  getQuestions,
  getPendingCompanies,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);

router.post('/tests', createTest);
router.put('/tests/:id', updateTest);
router.delete('/tests/:id', deleteTest);
router.get('/tests/:testId/questions', getQuestions);
router.post('/questions', addQuestion);

router.get('/pending-companies', getPendingCompanies);

module.exports = router;