const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const StudentProfile = require('../models/StudentProfile');

const companyFields = ['name', 'logo', 'description', 'industry', 'website', 'location', 'companySize'];
const applicationStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

const getCompanyForRecruiter = (recruiterId) => Company.findOne({ recruiterId });

const getDashboard = async (req, res) => {
  try {
    const company = await getCompanyForRecruiter(req.user._id);
    const jobs = company
      ? await Job.find({ recruiterId: req.user._id, companyId: company._id }).sort('-createdAt').lean()
      : [];
    const applicants = company
      ? await Application.find({ companyId: company._id }).lean()
      : [];
    return res.status(200).json({
      success: true,
      data: {
        company,
        jobs,
        applicants,
        stats: {
          totalJobs: jobs.length,
          activeJobs: jobs.filter((job) => job.isActive).length,
          applicants: applicants.length,
          shortlisted: applicants.filter((app) => app.status === 'Shortlisted').length,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch recruiter dashboard', error: error.message });
  }
};

const getCompanyProfile = async (req, res) => {
  try {
    const company = await getCompanyForRecruiter(req.user._id);
    return res.status(200).json({ success: true, data: company });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch company profile', error: error.message });
  }
};

const saveCompanyProfile = async (req, res) => {
  try {
    const payload = Object.fromEntries(
      companyFields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]])
    );
    if (!payload.name || !payload.name.trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }
    const company = await Company.findOneAndUpdate(
      { recruiterId: req.user._id },
      { $set: payload, $setOnInsert: { recruiterId: req.user._id } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, message: 'Company profile saved', data: company });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Could not save company profile', error: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const company = await getCompanyForRecruiter(req.user._id);
    if (!company) {
      return res.status(400).json({ success: false, message: 'Complete your company profile before posting a job' });
    }
    const payload = {
      ...req.body,
      recruiterId: req.user._id,
      companyId: company._id,
    };
    const job = await Job.create(payload);
    return res.status(201).json({ success: true, message: 'Job created', data: job });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Could not create job', error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.recruiterId;
    delete updates.companyId;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    return res.status(200).json({ success: true, message: 'Job updated', data: job });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Could not update job', error: error.message });
  }
};

const listApplicants = async (req, res) => {
  try {
    const company = await getCompanyForRecruiter(req.user._id);
    if (!company) return res.status(200).json({ success: true, data: [] });
    const apps = await Application.find({ companyId: company._id })
      .populate('studentId', 'name email phone')
      .populate('jobId', 'title location jobType')
      .sort('-appliedAt')
      .lean();
    const profiles = await StudentProfile.find({
      userId: { $in: apps.map((app) => app.studentId?._id).filter(Boolean) },
    }).select('userId college branch semester cgpa skills resumeUrl');
    const profilesByUser = new Map(profiles.map((profile) => [String(profile.userId), profile]));
    const data = apps.map((app) => ({
      ...app,
      studentProfile: app.studentId ? profilesByUser.get(String(app.studentId._id)) || null : null,
    }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch applicants', error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, recruiterNote } = req.body;
    if (!applicationStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }
    const company = await getCompanyForRecruiter(req.user._id);
    if (!company) return res.status(404).json({ success: false, message: 'Company profile not found' });
    const application = await Application.findOneAndUpdate(
      { _id: req.params.applicationId, companyId: company._id },
      { status, ...(recruiterNote !== undefined ? { recruiterNote } : {}) },
      { new: true, runValidators: true }
    ).populate('studentId', 'name email phone').populate('jobId', 'title');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    return res.status(200).json({ success: true, message: 'Application status updated', data: application });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Could not update application', error: error.message });
  }
};

module.exports = {
  getDashboard,
  getCompanyProfile,
  saveCompanyProfile,
  createJob,
  updateJob,
  listApplicants,
  updateApplicationStatus,
};
