import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const navigate = useNavigate();

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
              <div className="progress" style={{ width: '60%' }}></div>
            </div>
            <p>60% Complete</p>
          </div>

          <div className="course-content">
            <h4>Course Content</h4>
            <ul>
              <li className="completed">Introduction to Programming</li>
              <li className="completed">Variables and Data Types</li>
              <li className="active">Control Structures</li>
              <li>Functions and Methods</li>
              <li>Object-Oriented Programming</li>
            </ul>
          </div>

          <div className="resources-section">
            <h4>Resources</h4>
            <ul>
              <li>Course Notes</li>
              <li>Code Examples</li>
              <li>Practice Exercises</li>
              <li>Additional Reading</li>
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
          {activeTab === 'content' && (
            <div className="content-section">
              <div className="video-player">
                <div className="video-placeholder">
                  Video Player Will Go Here
                </div>
              </div>
              
              <div className="content-details">
                <h2>Control Structures</h2>
                <div className="content-description">
                  <p>Learn about if-else statements, loops, and other control structures in programming.</p>
                </div>
                
                <div className="code-editor">
                  <h3>Practice Exercise</h3>
                  <div className="editor-placeholder">
                    Code Editor Will Go Here
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="notes-section">
              <div className="notes-editor">
                <textarea 
                  placeholder="Take notes here..."
                  className="notes-textarea"
                ></textarea>
                <button className="save-notes">Save Notes</button>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="resources-section">
              <div className="resource-cards">
                <div className="resource-card">
                  <h3>Course Notes</h3>
                  <p>Download comprehensive course notes</p>
                  <button className="download-btn">Download</button>
                </div>
                <div className="resource-card">
                  <h3>Code Examples</h3>
                  <p>Access all code examples</p>
                  <button className="download-btn">Download</button>
                </div>
                <div className="resource-card">
                  <h3>Practice Exercises</h3>
                  <p>Get additional practice problems</p>
                  <button className="download-btn">Download</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 