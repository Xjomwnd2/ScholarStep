const express = require('express');
const router = express.Router();

// Demo scholarship data
let scholarships = [
  {
    id: 1,
    title: "Global STEM Excellence Scholarship",
    provider: "International Education Foundation",
    amount: 5000,
    deadline: "2026-06-30",
    status: "Open"
  },
  {
    id: 2,
    title: "Women in Technology Grant",
    provider: "Tech Future Initiative",
    amount: 3500,
    deadline: "2026-07-15",
    status: "Applied"
  }
];

// GET all scholarships
router.get('/', (req, res) => {
  res.json(scholarships);
});

// GET one scholarship
router.get('/:id', (req, res) => {
  const scholarship = scholarships.find(
    s => s.id === parseInt(req.params.id)
  );

  if (!scholarship) {
    return res.status(404).json({
      message: "Scholarship not found"
    });
  }

  res.json(scholarship);
});

// POST new scholarship
router.post('/', (req, res) => {
  const newScholarship = {
    id: scholarships.length + 1,
    ...req.body
  };

  scholarships.push(newScholarship);

  res.status(201).json(newScholarship);
});

module.exports = router;