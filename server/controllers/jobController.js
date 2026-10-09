const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');

const getJobs = async (req, res) => {
  try {
    const { search, location, jobType, workMode, skill, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (workMode) filter.workMode = workMode;
    if (skill) filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(filter)
      .populate('companyId', 'name logo industry location')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'companyId',
      'name logo description industry website location'
    );

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    let matchData = null;
    if (req.user && req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      if (profile && profile.skills) {
        matchData = calculateSkillMatch(profile.skills, job.requiredSkills);
      }
    }

    res.status(200).json({ success: true, data: { job, match: matchData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate('companyId', 'name logo')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, recruiterId: req.user._id });
    res.status(201).json({ success: true, message: 'Job created', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id, recruiterId: req.user._id });
    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const applications = await Application.find({ jobId: req.params.id })
      .populate('studentId', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const calculateSkillMatch = (studentSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { percentage: 0, matched: [], missing: [], status: 'No skills required' };
  }
  const studentSkillNames = studentSkills.map((s) => s.name.toLowerCase());
  const matched = [];
  const missing = [];
  requiredSkills.forEach((skill) => {
    if (studentSkillNames.includes(skill.toLowerCase())) matched.push(skill);
    else missing.push(skill);
  });
  const percentage = Math.round((matched.length / requiredSkills.length) * 100);
  let status = 'Needs Improvement';
  if (percentage >= 80) status = 'Excellent Match';
  else if (percentage >= 60) status = 'Good Match';
  else if (percentage >= 40) status = 'Average Match';
  return { percentage, matched, missing, status };
};

module.exports = { getJobs, getJob, getMyJobs, createJob, updateJob, deleteJob, getJobApplicants };