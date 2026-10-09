const Test = require('../models/Test');
const Question = require('../models/Question');
const TestResult = require('../models/TestResult');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get all active tests
const getTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true }).sort('-createdAt');

    // Add question count
    const testsWithCount = await Promise.all(
      tests.map(async (test) => {
        const count = await Question.countDocuments({ testId: test._id });
        return { ...test.toObject(), questionCount: count };
      })
    );

    res.status(200).json({ success: true, count: tests.length, data: testsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single test with questions (without answers)
const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    const questions = await Question.find({ testId: test._id }).select('-correctAnswer -explanation');

    res.status(200).json({
      success: true,
      data: { test, questions },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit test answers
const submitTest = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const testId = req.params.id;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    const questions = await Question.find({ testId });

    let correct = 0;
    const detailedAnswers = [];

    questions.forEach((q) => {
      const studentAnswer = answers[q._id.toString()];
      const isCorrect = studentAnswer === q.correctAnswer;
      if (isCorrect) correct++;

      detailedAnswers.push({
        questionId: q._id,
        selectedAnswer: studentAnswer || '',
        isCorrect,
      });
    });

    const total = questions.length;
    const wrong = total - correct;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    let skillLevel = 'Beginner';
    if (percentage >= 85) skillLevel = 'Expert';
    else if (percentage >= 70) skillLevel = 'Advanced';
    else if (percentage >= 50) skillLevel = 'Intermediate';

    const result = await TestResult.create({
      studentId: req.user._id,
      testId,
      answers: detailedAnswers,
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      percentage,
      skillLevel,
      timeTaken: timeTaken || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Test submitted',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my test results
const getMyResults = async (req, res) => {
  try {
    const results = await TestResult.find({ studentId: req.user._id })
      .populate('testId', 'title category')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTests, getTest, submitTest, getMyResults };