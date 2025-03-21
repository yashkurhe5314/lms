import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, enrollInCourse } from '../../store/slices/courseSlice';

const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCourse, loading, error } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  const handleEnroll = async () => {
    const result = await dispatch(enrollInCourse(id));
    if (!result.error) {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/courses');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!currentCourse) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          Course not found
        </Alert>
      </Container>
    );
  }

  const isEnrolled = currentCourse.enrolledStudents?.some(
    (student) => student._id === user?._id
  );

  const isInstructor = currentCourse.instructor?._id === user?._id;

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={`https://source.unsplash.com/random/800x400?${currentCourse.title}`}
                alt={currentCourse.title}
              />
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {currentCourse.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Instructor: {currentCourse.instructor?.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={currentCourse.level}
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={currentCourse.duration}
                    color="secondary"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`$${currentCourse.price}`}
                    color="success"
                  />
                </Box>
                <Typography variant="body1" paragraph>
                  {currentCourse.description}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h5" gutterBottom>
                  Course Modules
                </Typography>
                <List>
                  {currentCourse.modules?.map((module, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Module ${index + 1}: ${module.title}`}
                        secondary={`Duration: ${module.duration}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Instructor"
                      secondary={currentCourse.instructor?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Duration"
                      secondary={currentCourse.duration}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Level"
                      secondary={currentCourse.level}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Price"
                      secondary={`$${currentCourse.price}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Students Enrolled"
                      secondary={currentCourse.enrolledStudents?.length || 0}
                    />
                  </ListItem>
                </List>
                {!isInstructor && !isEnrolled && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleEnroll}
                    sx={{ mt: 2 }}
                  >
                    Enroll Now
                  </Button>
                )}
                {isEnrolled && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    disabled
                    sx={{ mt: 2 }}
                  >
                    Enrolled
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Successfully Enrolled!</DialogTitle>
        <DialogContent>
          <Typography>
            You have been successfully enrolled in {currentCourse.title}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseDetail; 