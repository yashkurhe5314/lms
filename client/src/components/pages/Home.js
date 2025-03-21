import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';
import { AdminPanelSettings } from '@mui/icons-material';

const featuredCourses = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Learn modern web development with React, Node.js, and MongoDB. Master frontend and backend technologies.',
    instructor: 'John Doe',
    duration: '12 weeks',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
  },
  {
    id: '2',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms. Learn problem-solving techniques and coding patterns.',
    instructor: 'Jane Smith',
    duration: '16 weeks',
    level: 'intermediate',
    image: 'https://images.unsplash.com/photo-1555066931-bf19f8e1083d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
  },
  {
    id: '3',
    title: 'Java Programming',
    description: 'Comprehensive Java programming course covering core concepts, OOP, and advanced features.',
    instructor: 'Mike Johnson',
    duration: '14 weeks',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '4',
    title: 'SQL & Database Management',
    description: 'Learn SQL fundamentals, database design, and management. Master data querying and optimization.',
    instructor: 'Sarah Wilson',
    duration: '10 weeks',
    level: 'beginner',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
  }
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  return (
    <Container>
      <Box sx={{ mt: 8, mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to LMS Portal
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {isAuthenticated
            ? `Welcome back, ${user?.name}!`
            : 'Start your learning journey today'}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<AdminPanelSettings />}
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </Button>
          )}
        </Box>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Featured Courses
      </Typography>

      <Grid container spacing={4}>
        {featuredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={3} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Instructor: {course.instructor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {course.duration}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Level: {course.level}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  Learn More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 