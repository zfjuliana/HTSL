import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Stack, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ExamSchedulerForm() {
  const [id, setId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [possibleDates, setPossibleDates] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [examTimes, setExamTimes] = useState([]);
  const [possibleRooms, setPossibleRooms] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState('');
  const [availableTimes, setAvailableTimes] = useState([
    '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM',
  ]);

  const handleIdChange = (event) => setId(event.target.value);
  const handleCourseNameChange = (event) => setCourseName(event.target.value);
  const handleNewDateChange = (event) => setNewDate(event.target.value);
  const handleExamTimesChange = (event) => setExamTimes(event.target.value);
  const handlePossibleRoomsChange = (event) => setPossibleRooms(event.target.value);
  const handleEnrolledStudentsChange = (event) => setEnrolledStudents(event.target.value);

  const handleAddDate = () => {
    if (newDate && !possibleDates.includes(newDate)) {
      setPossibleDates([...possibleDates, newDate]);
      setNewDate('');
    }
  };

  const handleRemoveDate = (date) => {
    setPossibleDates(possibleDates.filter((d) => d !== date));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      id,
      course: courseName,
      possibleDates,
      possibleTimeSlots: examTimes,
      possibleRooms: possibleRooms.split(',').map((room) => room.trim()),
      enrolledStudents: enrolledStudents.split(',').map((student) => student.trim()),
    };

    try {
      const response = await fetch('/api/update-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('Form submitted successfully!');
        console.log(responseData);
      } else {
        alert('Error submitting the form');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting the form');
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Exam Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Exam ID" variant="outlined" fullWidth value={id} onChange={handleIdChange} />
          <TextField label="Course Name" variant="outlined" fullWidth value={courseName} onChange={handleCourseNameChange} />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Add Possible Date"
              type="date"
              value={newDate}
              onChange={handleNewDateChange}
              InputLabelProps={{ shrink: true }}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" onClick={handleAddDate}>Add Date</Button>
          </Stack>
          <List>
            {possibleDates.map((date) => (
              <ListItem key={date} secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveDate(date)}>
                  <DeleteIcon />
                </IconButton>
              }>
                {date}
              </ListItem>
            ))}
          </List>
          <FormControl fullWidth>
            <InputLabel>Available Exam Times</InputLabel>
            <Select
              multiple
              value={examTimes}
              onChange={handleExamTimesChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Possible Rooms (comma-separated)"
            variant="outlined"
            fullWidth
            value={possibleRooms}
            onChange={handlePossibleRoomsChange}
          />
          <TextField
            label="Enrolled Students (comma-separated)"
            variant="outlined"
            fullWidth
            value={enrolledStudents}
            onChange={handleEnrolledStudentsChange}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
