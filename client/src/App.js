import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import CourseList from './components/courses/CourseList';
import CourseDetail from './components/courses/CourseDetail';
import CreateCourse from './components/courses/CreateCourse';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route
          path="/create-course"
          element={
            <PrivateRoute roles={['teacher', 'admin']}>
              <CreateCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
