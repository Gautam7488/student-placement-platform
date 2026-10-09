const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'Remote',
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Internship', 'Part Time'],
      default: 'Full Time',
    },
    salary: {
      type: String,
      default: 'Not disclosed',
    },
    experience: {
      type: String,
      default: 'Fresher',
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    minCGPA: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    eligibleBranches: [
      {
        type: String,
        trim: true,
      },
    ],
    applicationDeadline: {
      type: Date,
    },
    openings: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);