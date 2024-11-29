import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import AlertSnackbar from '@/components/alertSnackBar'; // Snackbar for conflict alerts

const StudentSchedule = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [conflictAlert, setConflictAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success'; // Changed severity to 'error' | 'success'
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch student's exam schedule on load
  useEffect(() => {
    const fetchStudentSchedule = async () => {
      try {
        const response = await fetch('/api/student/schedule');
        if (!response.ok) throw new Error('Failed to fetch student schedule');
        const data = await response.json();
        setExams(data.exams);

        // Detect conflicts in the fetched schedule
        const conflicts = detectConflicts(data.exams);
        if (conflicts.length > 0) {
          setConflictAlert({
            open: true,
            message: `Conflict detected: ${conflicts.length} overlapping exams!`,
            severity: 'error', // Set severity to 'error' for conflicts
          });
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setConflictAlert({
          open: true,
          message: 'Failed to load schedule.',
          severity: 'error', // Set severity to 'error' for failure to fetch
        });
      }
    };
    fetchStudentSchedule();
  }, []);

  // Function to detect schedule conflicts
  const detectConflicts = (exams: any[]) => {
    const conflicts: any[] = [];
    for (let i = 0; i < exams.length; i++) {
      for (let j = i + 1; j < exams.length; j++) {
        if (
          exams[i].start < exams[j].end &&
          exams[i].end > exams[j].start &&
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
