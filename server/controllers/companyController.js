const Company = require('../models/Company');

// @desc    Get all approved companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isApproved: true, isActive: true })
      .populate('recruiterId', 'name email');
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single company
const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my company (recruiter's own)
const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiterId: req.user._id });
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update company
const saveCompany = async (req, res) => {
  try {
    let company = await Company.findOne({ recruiterId: req.user._id });

    if (company) {
      company = await Company.findOneAndUpdate(
        { recruiterId: req.user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        data: company,
      });
    }

    company = await Company.create({ ...req.body, recruiterId: req.user._id });
    res.status(201).json({
      success: true,
      message: 'Company created (pending approval)',
      data: company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve company (Admin)
const approveCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Company approved', data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCompanies, getCompany, getMyCompany, saveCompany, approveCompany };