import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Paper, Select, MenuItem, InputLabel, FormControl, Grid, SelectChangeEvent } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import AlertSnackbar from '@/components/alertSnackBar'; // Snackbar for conflict alerts

const StudentSchedule = () => {
  // Simulated student data
  const studentsData = [
    { id: 1, name: 'John Doe', exams: [
      { course: 'CS101', date: new Date('2024-11-03T09:00:00'), duration: 2, room: 'Room 101' },
      { course: 'CS102', date: new Date('2024-11-04T11:00:00'), duration: 2, room: 'Room 202' },
    ] },
    { id: 2, name: 'Jane Smith', exams: [
      { course: 'CS103', date: new Date('2024-11-05T13:00:00'), duration: 2, room: 'Room 101' },
      { course: 'CS104', date: new Date('2024-11-06T14:00:00'), duration: 2, room: 'Room 202' },
    ] },
  ];

  const [selectedStudent, setSelectedStudent] = useState(studentsData[0]); // Default to the first student
  const [exams, setExams] = useState<any[]>(selectedStudent.exams);
  const [conflictAlert, setConflictAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle student selection change
  const handleStudentChange = (event: SelectChangeEvent<number>) => {
    const student = studentsData.find(s => s.id === event.target.value);
    if (student) {
      setSelectedStudent(student);
      setExams(student.exams); // Update the exams based on selected student
    }
  };

  // Function to detect schedule conflicts
  const detectConflicts = (exams: any[]) => {
    const conflicts: any[] = [];
    for (let i = 0; i < exams.length; i++) {
      for (let j = i + 1; j < exams.length; j++) {
        if (
          exams[i].date < exams[j].date + exams[j].duration * 60 * 1000 &&
          exams[i].date + exams[i].duration * 60 * 1000 > exams[j].date &&
          exams[i].room !== exams[j].room
        ) {
          conflicts.push([exams[i], exams[j]]);
        }
      }
    }
    return conflicts;
  };

  // Handle conflicts and show alerts
  useEffect(() => {
    const conflicts = detectConflicts(exams);
    if (conflicts.length > 0) {
      setConflictAlert({
        open: true,
        message: `Conflict detected: ${conflicts.length} overlapping exams!`,
        severity: 'error', // Set severity to 'error' for conflicts
      });
    }
  }, [exams]); // Dependency on exams to trigger when exams change

  // Function to close the Snackbar
  const handleCloseAlert = () => {
    setConflictAlert((prevAlert) => ({ ...prevAlert, open: false }));
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Student Selection Dropdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 'bold', mb: 2, marginTop: '60px'}}>
            Select Student
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="student-select-label">Student</InputLabel>
            <Select
              labelId="student-select-label"
              value={selectedStudent.id}
              onChange={handleStudentChange}
              label="Student"
              sx={{ minWidth: 200 }}
            >
              {studentsData.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" color="primary" sx={{ fontWeight: 'bold', marginTop: '60px' }}>
          {selectedStudent.name}'s Midterm Exam Schedule
        </Typography>
      </Box>

      {/* FullCalendar to display exams */}
      <Paper sx={{ flex: 1, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={exams.map((exam) => ({
            title: `${exam.course} Exam`,
            start: exam.date,
            end: new Date(exam.date).setHours(new Date(exam.date).getHours() + exam.duration),
            description: exam.room,
            color: 'blue', // Default color for non-conflicting exams
          }))}
          eventClick={(info) => window.alert(`Exam Details: ${info.event.title}`)}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
        />
      </Paper>

      {/* Snackbar for conflict alerts */}
      <Snackbar
        open={conflictAlert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <AlertSnackbar
          open={conflictAlert.open}
          message={conflictAlert.message}
          severity={conflictAlert.severity}
          onClose={handleCloseAlert}
        />
      </Snackbar>
    </Box>
  );
};

export default StudentSchedule;
