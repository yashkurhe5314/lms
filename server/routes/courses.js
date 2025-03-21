const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, checkRole } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'name email')
            .select('-modules -assessments');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name email')
            .populate('enrolledStudents', 'name email');
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create course (teachers only)
router.post('/', auth, checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            instructor: req.user._id
        });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update course (instructor or admin only)
router.patch('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if user is the instructor or admin
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this course' });
        }

        Object.assign(course, req.body);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete course (instructor or admin only)
router.delete('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if user is the instructor or admin
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this course' });
        }

        await course.remove();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if already enrolled
        if (course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        course.enrolledStudents.push(req.user._id);
        await course.save();

        // Add course to user's enrolled courses
        req.user.enrolledCourses.push(course._id);
        await req.user.save();

        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 