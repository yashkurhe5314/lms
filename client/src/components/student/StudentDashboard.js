import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  getProgress,
  getCourseContent,
  getLesson,
  saveNotes,
  completeLesson,
  updateLastAccessed
} from '../../services/studentService';
import { PlayCircle, CheckCircle, Book, Code, Assignment } from '@mui/icons-material';
import './StudentDashboard.css';

// Lazy load Monaco Editor
const Editor = lazy(() => import('@monaco-editor/react'));

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [courseContent, setCourseContent] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editorValue, setEditorValue] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    if (courseId) {
      loadCourseContent();
    } else {
      loadEnrolledCourses();
    }
  }, [courseId]);

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student/enrolled-courses');
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (err) {
      setError('Failed to load enrolled courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseContent = async () => {
    try {
      setLoading(true);
      const data = await getCourseContent(courseId);
      setCourseContent(data.lessons);
      setProgress(data.progress);
      
      // Load last accessed lesson or first lesson
      const lastAccessedId = data.progress.lastAccessedLesson || data.lessons[0]?._id;
      if (lastAccessedId) {
        loadLesson(lastAccessedId);
      }
    } catch (err) {
      setError('Failed to load course content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadLesson = async (lessonId) => {
    try {
      setLoading(true);
      const lesson = await getLesson(lessonId);
      setCurrentLesson(lesson);
      setEditorValue(lesson.codeExample || '');
      
      // Load notes if they exist
      const lessonNotes = progress?.notes.find(note => note.lesson === lessonId);
      setNotes(lessonNotes?.content || '');
      
      // Update last accessed
      await updateLastAccessed(lessonId);
    } catch (err) {
      setError('Failed to load lesson');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    loadLesson(lessonId);
  };

  const handleSaveNotes = async () => {
    try {
      await saveNotes(currentLesson._id, notes);
      // Show success message or update UI
    } catch (err) {
      setError('Failed to save notes');
      console.error(err);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      await completeLesson(currentLesson._id);
      // Update progress in state
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, currentLesson._id]
      }));
    } catch (err) {
      setError('Failed to mark lesson as complete');
      console.error(err);
    }
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!courseId) {
    return (
      <div className="student-dashboard">
        <div className="dashboard-main">
          <div className="content-section">
            <h2>My Courses</h2>
            <div className="course-grid">
              {enrolledCourses.map(course => (
                <div key={course._id} className="course-card" onClick={() => navigate(`/student/dashboard/${course._id}`)}>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ 
                          width: `${(course.progress?.completedLessons?.length / course.lessons?.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p>{Math.round((course.progress?.completedLessons?.length / course.lessons?.length) * 100)}% Complete</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const courseCategories = [
    'All Courses',
    'Python',
    'JavaScript',
    'Java',
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Mobile Development'
  ];

  return (
    <div className="student-dashboard">
      {/* Course Navigation */}
      <div className="course-nav">
        {courseCategories.map((category, index) => (
          <button
            key={index}
            className={index === 0 ? 'active' : ''}
            onClick={() => {/* Handle category change */}}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>Course Progress</h3>
        </div>
        
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ 
                width: `${(progress?.completedLessons.length / courseContent?.length) * 100}%` 
              }}
            ></div>
          </div>
          <p>{Math.round((progress?.completedLessons.length / courseContent?.length) * 100)}% Complete</p>
        </div>

        <div className="course-content">
          <h4>Course Content</h4>
          <ul>
            {courseContent?.map(lesson => (
              <li
                key={lesson._id}
                className={`${progress?.completedLessons.includes(lesson._id) ? 'completed' : ''} 
                          ${currentLesson?._id === lesson._id ? 'active' : ''}`}
                onClick={() => handleLessonClick(lesson._id)}
              >
                {progress?.completedLessons.includes(lesson._id) ? (
                  <CheckCircle style={{ marginRight: '8px' }} />
                ) : (
                  <PlayCircle style={{ marginRight: '8px' }} />
                )}
                {lesson.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="content-section">
          {currentLesson && (
            <>
              <div className="video-player">
                <ReactPlayer
                  url={currentLesson.videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
              
              <div className="content-details">
                <h2>{currentLesson.title}</h2>
                <div className="content-description">
                  <p>{currentLesson.description}</p>
                </div>
                
                <div className="code-editor">
                  <h3>Practice Exercise</h3>
                  <Suspense fallback={<div className="editor-loading">Loading editor...</div>}>
                    <Editor
                      height="300px"
                      defaultLanguage="javascript"
                      value={editorValue}
                      onChange={handleEditorChange}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyond: false,
                        automaticLayout: true
                      }}
                    />
                  </Suspense>
                </div>

                <button 
                  className="complete-lesson-btn"
                  onClick={handleCompleteLesson}
                  disabled={progress?.completedLessons.includes(currentLesson._id)}
                >
                  {progress?.completedLessons.includes(currentLesson._id) 
                    ? 'Completed' 
                    : 'Mark as Complete'}
                </button>
              </div>

              <div className="notes-section">
                <h3>Notes</h3>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes here..."
                  className="notes-textarea"
                ></textarea>
                <button className="save-notes" onClick={handleSaveNotes}>
                  Save Notes
                </button>
              </div>

              {currentLesson.resources?.length > 0 && (
                <div className="resources-section">
                  <h3>Additional Resources</h3>
                  <div className="resource-cards">
                    {currentLesson.resources.map((resource, index) => (
                      <div key={index} className="resource-card">
                        <h3>{resource.title}</h3>
                        <p>{resource.type}</p>
                        <a 
                          href={resource.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="download-btn"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 