import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../store/slices/courseSlice';

const CreateCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.courses);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    price: '',
    modules: [{ title: '', duration: '', content: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModuleChange = (index, field, value) => {
    const newModules = [...courseData.modules];
    newModules[index] = {
      ...newModules[index],
      [field]: value,
    };
    setCourseData((prev) => ({
      ...prev,
      modules: newModules,
    }));
  };

  const addModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: '', duration: '', content: '' }],
    }));
  };

  const removeModule = (index) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createCourse(courseData));
    if (!result.error) {
      navigate('/courses');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Course
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course Title"
                  name="title"
                  value={courseData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  name="duration"
                  value={courseData.duration}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Level"
                  name="level"
                  value={courseData.level}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={courseData.price}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Course Modules
                </Typography>
                <List>
                  {courseData.modules.map((module, index) => (
                    <ListItem key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Module Title"
                            value={module.title}
                            onChange={(e) =>
                              handleModuleChange(index, 'title', e.target.value)
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Duration"
                            value={module.duration}
                            onChange={(e) =>
                              handleModuleChange(index, 'duration', e.target.value)
                            }
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Content"
                            value={module.content}
                            onChange={(e) =>
                              handleModuleChange(index, 'content', e.target.value)
                            }
                            required
                          />
                        </Grid>
                      </Grid>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => removeModule(index)}
                          disabled={courseData.modules.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addModule}
                  sx={{ mt: 2 }}
                >
                  Add Module
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/courses')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create Course
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateCourse; 