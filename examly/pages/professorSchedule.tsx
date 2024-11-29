import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Snackbar, Alert, Modal, Grid, Typography, Paper } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import AlertSnackbar from '@/components/alertSnackBar'; // Snackbar for conflict alerts
import ExamSchedulerForm from '@/components/Form';
import { useRouter } from "next/router";
import { ArrowBack } from '@mui/icons-material';

const ProfessorSchedule = () => {
    const router = useRouter();
  const [events, setEvents] = useState<any[]>([
    { title: 'Exam 1', start: new Date('2024-12-01T09:00:00'), end: new Date('2024-12-01T11:00:00'), room: 'Room 101' },
    { title: 'Exam 2', start: new Date('2024-12-01T13:00:00'), end: new Date('2024-12-01T15:00:00'), room: 'Room 202' },
  ]);
  const [rooms, setRooms] = useState<string[]>(['Room 101', 'Room 202', 'Room 303']);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [conflictAlert, setConflictAlert] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [openModal, setOpenModal] = useState(false);

  // Check for conflicts between events
  const checkForConflicts = (newEvent: any) => {
    return events.some(
      (event) =>
        event.room === newEvent.room &&
        event.start < newEvent.end &&
        event.end > newEvent.start
    );
  };

  // Handle slot selection from the calendar
  const handleSlotSelect = (slotInfo: any) => {
    setSelectedSlot(slotInfo);
    setOpenModal(true);
  };

  // Handle exam booking
  const handleBookExam = async () => {
    if (!selectedRoom || !selectedSlot) {
      setConflictAlert({ open: true, message: 'Please select a room and time.' });
      return;
    }

    const newEvent = {
      title: 'Exam',
      start: selectedSlot.start,
      end: selectedSlot.end,
      room: selectedRoom,
    };

    if (checkForConflicts(newEvent)) {
      setConflictAlert({ open: true, message: 'Conflict detected: Room already booked!' });
    } else {
      setEvents([...events, newEvent]); // Add new event to the calendar
      setOpenModal(false);
      setConflictAlert({ open: true, message: 'Exam successfully scheduled!' });
    }
  };
  
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

      <Typography variant="h3" component="h1" color="primary" sx={{ fontWeight: 'bold', marginTop: '70px', marginBottom: '50px'}}>
        Professor Exam Scheduling
      </Typography>
      
      {/* FullCalendar to display exams */}
      <Paper sx={{ flex: 1, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events.map((exam) => ({
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

      {/* Modal for confirming booking */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Confirm Exam Booking
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room"
                select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="">Select a Room</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleBookExam}>
                Book Exam
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Snackbar for success or conflict alerts */}
      <Snackbar
        open={conflictAlert.open}
        autoHideDuration={4000}
        onClose={() => setConflictAlert({ ...conflictAlert, open: false })}
      >
        <Alert severity={conflictAlert.message.includes('Conflict') ? 'error' : 'success'}>
          {conflictAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfessorSchedule;
