const express = require('express');
const router = express.Router();
const {
  getJobs, getJob, getMyJobs, createJob, updateJob, deleteJob, getJobApplicants,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.get('/:id/applicants', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) return protect(req, res, next);
  next();
}, getJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;