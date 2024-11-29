import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Snackbar,
  Alert,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ExamSchedulerForm from '@/components/Form';
import { useRouter } from 'next/router';
import { ArrowBack } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';

const ProfessorSchedule = () => {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [conflictAlert, setConflictAlert] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  // Fetch scheduled exams from the optimized schedule
  const fetchScheduledExams = async () => {
    try {
      const response = await fetch('/api/professor-events');
      if (!response.ok) {
        throw new Error(`Failed to fetch scheduled exams: ${response.statusText}`);
      }
      const data = await response.json();
      setEvents(data.professorEvents || []);
    } catch (error) {
      console.error('Error fetching scheduled exams:', error);
      setConflictAlert({ open: true, message: 'Failed to load scheduled exams.' });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchScheduledExams();
  }, []);

  const handleBackClick = () => {
    router.push('/'); // Navigate back to the Landing page
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Back Button */}
       <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center text-sm font-semibold text-blue-600 bg-transparent border border-blue-600 hover:bg-blue-100 rounded-lg px-4 py-2"
      >
        <ArrowBack className="mr-2" />
        Back
      </button>

      <ExamSchedulerForm />

      <Typography
        variant="h3"
        component="h1"
        color="primary"
        sx={{ fontWeight: 'bold', marginTop: '70px', marginBottom: '50px' }}
      >
        Professor Exam Scheduling
      </Typography>

      {/* FullCalendar to display exams */}
      <Paper sx={{ flex: 1, overflow: 'hidden', borderRadius: 2, boxShadow: 3, mb: 4 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          initialDate="2024-01-01"

          events={events.map((exam) => ({
            title: `${exam.courseName || exam.examId || exam.id} Exam`,
            start: new Date(exam.assignedTimeSlot),
            end: new Date(new Date(exam.assignedTimeSlot).getTime() + 2 * 60 * 60 * 1000),
            description: exam.assignedRoom,
            color: 'blue', // Default color for exams
          }))}
          eventClick={(info) =>
            window.alert(
              `Exam Details:\n${info.event.title}\nRoom: ${info.event.extendedProps.description}`
            )
          }
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
        />
      </Paper>

      {/* New Div to display fetched exams */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Fetched Exams:
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <List>
          {events.map((exam, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`Exam: ${exam.courseName || exam.examId || exam.id}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Time Slot: {exam.assignedTimeSlot}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.primary">
                      Assigned Room: {exam.assignedRoom}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Snackbar for alerts */}
      <Snackbar
        open={conflictAlert.open}
        autoHideDuration={4000}
        onClose={() => setConflictAlert({ ...conflictAlert, open: false })}
      >
        <Alert severity={conflictAlert.message.includes('Failed') ? 'error' : 'success'}>
          {conflictAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfessorSchedule;
