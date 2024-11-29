import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Stack } from '@mui/material';

export default function ExamSchedulerForm() {
  const [courseName, setCourseName] = useState('');
  const [examTimes, setExamTimes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([
    '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'
  ]);

  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  };

  const handleExamTimesChange = (event) => {
    setExamTimes(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      courseName,
      examTimes
    });
    alert('Form submitted!');
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Exam Details
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            value={courseName}
            onChange={handleCourseNameChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              },
              '& .MuiInputLabel-root': {
                fontSize: '16px',
              },
            }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Available Exam Times</InputLabel>
            <Select
              multiple
              value={examTimes}
              onChange={handleExamTimesChange}
              label="Available Exam Times"
              renderValue={(selected) => selected.join(', ')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                },
              }}
            >
              {availableTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
              alignSelf: 'center',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#3f51b5',
              },
            }}
          >
            Submit
          </Button>

        </Stack>
      </form>
    </Box>
  );
}
