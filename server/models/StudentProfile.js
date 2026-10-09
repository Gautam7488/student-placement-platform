const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Academic Information
    enrollmentNumber: {
      type: String,
      trim: true,
      default: '',
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    semester: {
      type: String,
      trim: true,
      default: '',
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    graduationYear: {
      type: Number,
      default: null,
    },

    // Personal Information
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: '',
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },

    // Technical Skills
    skills: [
      {
        name: { type: String, required: true, trim: true },
        category: { type: String, default: 'Other', trim: true },
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Beginner',
        },
      },
    ],

    // Soft Skills
    softSkills: [
      {
        name: { type: String, required: true, trim: true },
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Beginner',
        },
      },
    ],

    // Projects
    projects: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        technologies: { type: String, default: '' },
        githubLink: { type: String, default: '' },
        liveLink: { type: String, default: '' },
      },
    ],

    // Certifications
    certifications: [
      {
        name: { type: String, required: true, trim: true },
        organization: { type: String, default: '' },
        date: { type: String, default: '' },
      },
    ],

    // Experience
    experience: [
      {
        organization: { type: String, required: true, trim: true },
        role: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],

    // Achievements
    achievements: [{ type: String, trim: true }],

    // Resume
    resumeUrl: {
      type: String,
      default: '',
    },

    // Profile completion percentage (calculated)
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);