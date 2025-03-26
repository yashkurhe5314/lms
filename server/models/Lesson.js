const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  resources: [{
    title: String,
    fileUrl: String,
    type: String // 'notes', 'code', 'exercise'
  }],
  codeExample: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema); 