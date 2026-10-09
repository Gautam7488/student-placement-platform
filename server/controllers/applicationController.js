const Application = require('../models/Application');
const Job = require('../models/Job');

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: 'Job ID is required' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const existing = await Application.findOne({ studentId: req.user._id, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied' });
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId,
      companyId: job.companyId,
      status: 'Applied',
    });

    res.status(201).json({ success: true, message: 'Application submitted', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.user._id })
      .populate('jobId', 'title location jobType salary')
      .populate('companyId', 'name logo')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecruiterApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).select('_id');
    const jobIds = jobs.map((j) => j._id);

    const apps = await Application.find({ jobId: { $in: jobIds } })
      .populate('studentId', 'name email phone')
      .populate('jobId', 'title location jobType')
      .populate('companyId', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyJob, getMyApplications, getRecruiterApplications, updateApplicationStatus };