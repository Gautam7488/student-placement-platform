const User = require('../models/User');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get dashboard stats
const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalTests = await Test.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalTests,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create test
const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ success: true, message: 'Test created', data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update test
const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete test
const deleteTest = async (req, res) => {
  try {
    await Question.deleteMany({ testId: req.params.id });
    await Test.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add question
const addQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    await Test.findByIdAndUpdate(req.body.testId, { $inc: { totalQuestions: 1 } });
    res.status(201).json({ success: true, message: 'Question added', data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get questions by test
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });
    res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending companies
const getPendingCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isApproved: false })
      .populate('recruiterId', 'name email');
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  createTest,
  updateTest,
  deleteTest,
  addQuestion,
  getQuestions,
  getPendingCompanies,
};