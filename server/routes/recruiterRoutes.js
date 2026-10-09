const express = require('express');
const {
  getDashboard,
  getCompanyProfile,
  saveCompanyProfile,
  createJob,
  updateJob,
  listApplicants,
  updateApplicationStatus,
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/dashboard', authorize('recruiter', 'admin'), getDashboard);
router.get('/company', authorize('recruiter', 'admin'), getCompanyProfile);
router.put('/company', authorize('recruiter', 'admin'), saveCompanyProfile);
router.post('/jobs', authorize('recruiter', 'admin'), createJob);
router.put('/jobs/:id', authorize('recruiter', 'admin'), updateJob);
router.get('/applicants', authorize('recruiter', 'admin'), listApplicants);
router.patch('/applications/:applicationId/status', authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
