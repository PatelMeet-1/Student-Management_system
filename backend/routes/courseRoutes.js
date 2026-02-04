const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// ✅ Add course
router.post('/add', courseController.addCourse);

// ✅ Get all courses
router.get('/', courseController.getCourses);

// ✅ Update course
router.put('/:id', courseController.updateCourse);

// ✅ Delete course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
