const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompany,
  getMyCompany,
  saveCompany,
  approveCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCompanies);
router.get('/my-company', protect, authorize('recruiter'), getMyCompany);
router.post('/', protect, authorize('recruiter'), saveCompany);
router.get('/:id', getCompany);
router.put('/:id/approve', protect, authorize('admin'), approveCompany);

module.exports = router;