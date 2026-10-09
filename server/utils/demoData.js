const demoUsers = [
  {
    id: 'u-student-1',
    name: 'Aarav Patel',
    email: 'student@example.com',
    password: '$2a$10$9f8kPQoLJdP2J2vNDO/6Qe8aLsiIkcvp/yAsmJpBNYQy3zXh7oTJC',
    role: 'student',
    phone: '9876543210',
    gender: 'Male',
    college: 'GTU College of Engineering',
    branch: 'Computer Engineering',
    semester: '7',
    enrollmentNumber: '190170107001',
    location: 'Ahmedabad',
    cgpa: 8.9,
    skills: [
      { name: 'JavaScript', category: 'Frontend', level: 'Advanced' },
      { name: 'Node.js', category: 'Backend', level: 'Intermediate' },
      { name: 'React', category: 'Frontend', level: 'Advanced' }
    ],
    projects: [{ name: 'Campus Connect', description: 'Student placement tracker', technologies: 'React, Node.js', github: 'https://github.com/demo' }],
    certifications: [{ name: 'AWS Cloud Practitioner', organization: 'AWS', date: '2024' }],
    resume: 'https://example.com/resume.pdf',
    notifications: [],
    bookmarks: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u-recruiter-1',
    name: 'Nisha Shah',
    email: 'recruiter@example.com',
    password: '$2a$10$9f8kPQoLJdP2J2vNDO/6Qe8aLsiIkcvp/yAsmJpBNYQy3zXh7oTJC',
    role: 'recruiter',
    companyName: 'TechNova Solutions',
    companyId: 'c-1',
    phone: '9988776655',
    location: 'Bengaluru',
    notifications: [],
    bookmarks: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u-admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$9f8kPQoLJdP2J2vNDO/6Qe8aLsiIkcvp/yAsmJpBNYQy3zXh7oTJC',
    role: 'admin',
    notifications: [],
    bookmarks: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const demoCompanies = [
  {
    id: 'c-1',
    name: 'TechNova Solutions',
    description: 'Fast-growing product engineering company',
    industry: 'Software',
    location: 'Bengaluru',
    website: 'https://technova.example.com',
    companySize: '201-500',
    recruiterId: 'u-recruiter-1',
    approved: true,
    active: true,
  }
];

const demoJobs = [
  {
    id: 'j-1',
    title: 'Frontend Developer Intern',
    description: 'Build modern UI dashboards and improve user experience for enterprise clients.',
    companyId: 'c-1',
    companyName: 'TechNova Solutions',
    recruiterId: 'u-recruiter-1',
    location: 'Remote',
    workMode: 'Remote',
    salary: '₹30k - ₹50k',
    experience: '0-1 years',
    requiredSkills: ['React', 'JavaScript', 'CSS'],
    preferredSkills: ['Bootstrap', 'REST APIs'],
    minCGPA: 7,
    eligibleBranches: ['Computer Engineering', 'IT'],
    applicationDeadline: '2026-12-15',
    jobType: 'Internship',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'j-2',
    title: 'Full Stack Developer',
    description: 'Join our team to build and maintain end-to-end digital products.',
    companyId: 'c-1',
    companyName: 'TechNova Solutions',
    recruiterId: 'u-recruiter-1',
    location: 'Ahmedabad',
    workMode: 'Hybrid',
    salary: '₹8 LPA',
    experience: '1-3 years',
    requiredSkills: ['Node.js', 'MongoDB', 'React'],
    preferredSkills: ['Express', 'JWT'],
    minCGPA: 7.5,
    eligibleBranches: ['Computer Engineering', 'IT', 'EC'],
    applicationDeadline: '2026-11-30',
    jobType: 'Full Time',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

const demoApplications = [
  {
    id: 'a-1',
    studentId: 'u-student-1',
    studentName: 'Aarav Patel',
    jobId: 'j-1',
    companyId: 'c-1',
    companyName: 'TechNova Solutions',
    resume: 'https://example.com/resume.pdf',
    status: 'Applied',
    appliedAt: new Date().toISOString(),
  }
];

const demoQuestions = [
  { id: 'q-1', category: 'JavaScript', question: 'Which keyword is used to declare a constant in JavaScript?', options: ['let', 'const', 'var', 'static'], answer: 'const', explanation: 'const prevents reassignment to a variable binding.' },
  { id: 'q-2', category: 'React', question: 'What is JSX?', options: ['JavaScript XML', 'A database engine', 'CSS framework', 'HTTP library'], answer: 'JavaScript XML', explanation: 'JSX is a syntax extension for writing UI elements in JavaScript.' },
  { id: 'q-3', category: 'DBMS', question: 'Which command is used to retrieve records from a database?', options: ['INSERT', 'DELETE', 'SELECT', 'UPDATE'], answer: 'SELECT', explanation: 'SELECT is used to fetch rows from a table.' },
];

const demoFeedback = [
  { id: 'f-1', userId: 'u-student-1', userName: 'Aarav Patel', rating: 5, feedback: 'The platform is intuitive and helps me prepare for campus placements.' } 
];

const demoNotifications = [
  { id: 'n-1', userId: 'u-student-1', title: 'Placement update', message: 'Your interview round update is now available.', type: 'info', read: false },
  { id: 'n-2', userId: 'u-recruiter-1', title: 'Shortlist alert', message: '2 students have applied for Frontend Developer Intern.', type: 'alert', read: false }
];

const demoSkills = [
  { id: 's-1', name: 'JavaScript', category: 'Programming', description: 'Frontend and backend scripting language' },
  { id: 's-2', name: 'React', category: 'Frontend', description: 'Component-based UI library' },
  { id: 's-3', name: 'Node.js', category: 'Backend', description: 'JavaScript runtime for server-side logic' },
  { id: 's-4', name: 'MongoDB', category: 'Database', description: 'Document-based NoSQL database' }
];

module.exports = {
  demoUsers,
  demoCompanies,
  demoJobs,
  demoApplications,
  demoQuestions,
  demoFeedback,
  demoNotifications,
  demoSkills,
};
