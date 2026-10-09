const { Skill } = require('../models');
const { demoSkills } = require('../utils/demoData');
const mongoose = require('mongoose');

const listSkills = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const skills = await Skill.find({ active: true });
    return res.status(200).json({ success: true, data: skills });
  }

  return res.status(200).json({ success: true, data: demoSkills });
};

const createSkill = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const skill = await Skill.create(req.body);
      return res.status(201).json({ success: true, message: 'Skill added', data: skill });
    }

    const skill = { id: `s-${Date.now()}`, ...req.body };
    demoSkills.push(skill);
    return res.status(201).json({ success: true, message: 'Skill added', data: skill });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not add skill', error: error.message });
  }
};

module.exports = { listSkills, createSkill };
