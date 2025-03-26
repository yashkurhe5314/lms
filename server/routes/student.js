const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// Get student's course progress
router.get('/progress/:courseId', auth, checkRole(['student']), async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId
    }).populate('completedLessons');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get course content
router.get('/course/:courseId', auth, checkRole(['student']), async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort({ order: 1 });
    
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId
    });

    res.json({
      lessons,
      progress: progress || { completedLessons: [], lastAccessedLesson: null }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get specific lesson
router.get('/lesson/:lessonId', auth, checkRole(['student']), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Save notes
router.post('/notes/:lessonId', auth, checkRole(['student']), async (req, res) => {
  try {
    const { content } = req.body;
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const progress = await Progress.findOne({
      student: req.user._id,
      course: lesson.course
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const noteIndex = progress.notes.findIndex(
      note => note.lesson.toString() === req.params.lessonId
    );

    if (noteIndex > -1) {
      progress.notes[noteIndex].content = content;
      progress.notes[noteIndex].lastUpdated = Date.now();
    } else {
      progress.notes.push({
        lesson: req.params.lessonId,
        content,
        lastUpdated: Date.now()
      });
    }

    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Mark lesson as completed
router.post('/complete/:lessonId', auth, checkRole(['student']), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const progress = await Progress.findOne({
      student: req.user._id,
      course: lesson.course
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    if (!progress.completedLessons.includes(req.params.lessonId)) {
      progress.completedLessons.push(req.params.lessonId);
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update last accessed lesson
router.put('/last-accessed/:lessonId', auth, checkRole(['student']), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const progress = await Progress.findOne({
      student: req.user._id,
      course: lesson.course
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    progress.lastAccessedLesson = req.params.lessonId;
    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get enrolled courses
router.get('/enrolled-courses', auth, checkRole(['student']), async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user._id })
      .populate('instructor', 'name email');
    
    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
      const progress = await Progress.findOne({
        student: req.user._id,
        course: course._id
      });
      
      return {
        ...course.toObject(),
        progress: progress || { completedLessons: [], lastAccessedLesson: null }
      };
    }));

    res.json(coursesWithProgress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 