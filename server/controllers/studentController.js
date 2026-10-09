const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// @desc    Get student profile
const getProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile
const updateProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id, ...req.body });
    } else {
      profile = await StudentProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
    }
    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a skill
// @route   POST /api/students/skills
const addSkill = async (req, res) => {
  try {
    const { name, category, level } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id });
    }

    // Check duplicate
    const exists = profile.skills.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ success: false, message: 'Skill already added' });
    }

    profile.skills.push({
      name: name.trim(),
      category: category || 'Other',
      level: level || 'Beginner',
    });

    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();

    res.status(201).json({ success: true, message: 'Skill added successfully', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/students/skills/:skillId
const updateSkill = async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const skill = profile.skills.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    if (name) skill.name = name.trim();
    if (category) skill.category = category;
    if (level) skill.level = level;

    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();

    res.status(200).json({ success: true, message: 'Skill updated', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/students/skills/:skillId
const deleteSkill = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.skills = profile.skills.filter(
      (s) => s._id.toString() !== req.params.skillId
    );

    profile.profileCompletion = calculateProfileCompletion(profile);
    await profile.save();

    res.status(200).json({ success: true, message: 'Skill deleted', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Calculate profile completion percentage
const calculateProfileCompletion = (profile) => {
  let score = 0;
  if (profile.college && profile.branch && profile.semester) score += 10;
  if (profile.cgpa > 0 && profile.graduationYear) score += 10;
  if (profile.gender && profile.dateOfBirth && profile.location) score += 10;
  if (profile.skills && profile.skills.length >= 3) score += 20;
  if (profile.projects && profile.projects.length >= 1) score += 15;
  if (profile.certifications && profile.certifications.length >= 1) score += 10;
  if (profile.experience && profile.experience.length >= 1) score += 10;
  if (profile.resumeUrl) score += 5;
  return Math.min(score, 100);
};

module.exports = {
  getProfile,
  updateProfile,
  addSkill,
  updateSkill,
  deleteSkill,
  calculateProfileCompletion,
};