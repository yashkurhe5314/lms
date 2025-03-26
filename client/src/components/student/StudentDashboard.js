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
  
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    loadCourseContent();
  }, [courseId]);

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

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>My Learning</h3>
        </div>
        
        <div className="sidebar-content">
          <div className="progress-section">
            <h4>Course Progress</h4>
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
                  {lesson.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="resources-section">
            <h4>Resources</h4>
            <ul>
              {currentLesson?.resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="main-header">
          <div className="tab-navigation">
            <button 
              className={`tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button 
              className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
            <button 
              className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'content' && currentLesson && (
            <div className="content-section">
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
                      height="200px"
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
            </div>
          )}

          {activeTab === 'notes' && currentLesson && (
            <div className="notes-section">
              <div className="notes-editor">
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
            </div>
          )}

          {activeTab === 'resources' && currentLesson && (
            <div className="resources-section">
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
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 