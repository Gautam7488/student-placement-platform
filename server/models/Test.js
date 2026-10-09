const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability',
        'Technical',
      ],
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 30, // minutes
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    passingScore: {
      type: Number,
      default: 40, // percentage
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);