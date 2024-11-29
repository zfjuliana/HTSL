import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Paper } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import AlertSnackbar from '@/components/alertSnackBar'; // Snackbar for conflict alerts

const StudentSchedule = () => {
  const [exams, setExams] = useState<any[]>([]); // Initialize as an empty array
  const [conflictAlert, setConflictAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Function to detect schedule conflicts
  const detectConflicts = (exams: any[]) => {
    const conflicts: any[] = [];
    for (let i = 0; i < exams.length; i++) {
      for (let j = i + 1; j < exams.length; j++) {
        const start1 = new Date(exams[i].date).getTime();
        const end1 = start1 + exams[i].duration * 60 * 60 * 1000;
        const start2 = new Date(exams[j].date).getTime();
        const end2 = start2 + exams[j].duration * 60 * 60 * 1000;

        if (start1 < end2 && end1 > start2 && exams[i].room === exams[j].room) {
          conflicts.push([exams[i], exams[j]]);
        }
      }
    }
    return conflicts;
  };

  // Fetch timetable data from the API
  const fetchExamData = async () => {
    try {
      console.log('Fetching timetable data from API.');
      const response = await fetch('/api/get-exams'); // Updated API endpoint
      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.statusText}`);
      }
      const data = await response.json();

      // Extract and transform the data for the current student (replace 'student1' with the actual student ID)
      const studentId = 'student1'; // Replace with actual student ID or fetch from context/auth
      const studentTimetable = data.studentTimetables[studentId] || [];
      const transformedExams = studentTimetable.map((exam: any) => ({
        course: exam.examId,
        date: new Date(exam.timeSlot),
        duration: 2, // Assuming a default duration of 2 hours (update as needed)
        room: exam.roomId,
      }));

      setExams(transformedExams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setConflictAlert({
        open: true,
        message: 'Failed to load exam schedule.',
        severity: 'error',
      });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchExamData();
  }, []); // Run only once when the component mounts

  // Detect conflicts whenever exams state changes
  useEffect(() => {
    if (exams.length > 0) {
      const conflicts = detectConflicts(exams);
      if (conflicts.length > 0) {
        setConflictAlert({
          open: true,
          message: `Conflict detected: ${conflicts.length} overlapping exams!`,
          severity: 'error',
        });
      }
    }
  }, [exams]);

  // Function to close the Snackbar
  const handleCloseAlert = () => {
    setConflictAlert((prevAlert) => ({ ...prevAlert, open: false }));
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" color="primary" sx={{ fontWeight: 'bold' }}>
          Your Midterm Exam Schedule
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
            end: new Date(exam.date.getTime() + exam.duration * 60 * 60 * 1000),
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
