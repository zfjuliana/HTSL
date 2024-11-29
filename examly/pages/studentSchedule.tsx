import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import AlertSnackbar from '@/components/alertSnackBar'; // Snackbar for conflict alerts

const StudentSchedule = () => {
  const [exams, setExams] = useState<any[]>([
    { course: 'CS101', date: new Date('2024-12-01T09:00:00'), duration: 2, room: 'Room 101' },
    { course: 'CS102', date: new Date('2024-12-01T11:00:00'), duration: 2, room: 'Room 202' },
    { course: 'CS103', date: new Date('2024-12-01T13:00:00'), duration: 2, room: 'Room 101' },
    { course: 'CS104', date: new Date('2024-12-01T14:00:00'), duration: 2, room: 'Room 202' },
  ]);
  const [conflictAlert, setConflictAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success'; // Changed severity to 'error' | 'success'
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
        if (
          exams[i].date < exams[j].date + exams[j].duration * 60 * 1000 &&
          exams[i].date + exams[i].duration * 60 * 1000 > exams[j].date &&
          exams[i].room !== exams[j].room // Exams in different rooms don't cause issues for students
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Your Midterm Exam Schedule
      </Typography>

      {/* FullCalendar to display exams */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={exams.map((exam) => ({
          title: `${exam.course} Exam`,
          start: exam.date,
          end: new Date(exam.date).setHours(new Date(exam.date).getHours() + exam.duration),
          description: exam.room,
          color: 'green', // Default color for non-conflicting exams
        }))}
        eventClick={(info) => window.alert(`Exam Details: ${info.event.title}`)}
      />

      {/* Snackbar for conflict alerts */}
      <Snackbar open={conflictAlert.open} autoHideDuration={4000} onClose={handleCloseAlert}>
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
