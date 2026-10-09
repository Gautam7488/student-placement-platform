const express = require('express');
const { demoStudents = [] } = require('../utils/demoData');

const router = express.Router();

router.get('/xml', (req, res) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<students>\n  <student id="u-student-1">\n    <name>Aarav Patel</name>\n    <college>GTU College of Engineering</college>\n    <branch>Computer Engineering</branch>\n    <cgpa>8.9</cgpa>\n  </student>\n</students>`;

  res.setHeader('Content-Type', 'application/xml');
  return res.status(200).send(xml);
});

module.exports = router;
