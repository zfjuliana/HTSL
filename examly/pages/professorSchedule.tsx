import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Snackbar, Alert, Modal, Grid, Typography } from '@mui/material';
import CalendarView from '@/components/calenderView';

const ProfessorSchedule = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [conflictAlert, setConflictAlert] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [openModal, setOpenModal] = useState(false);

  // Fetch rooms and events when component loads
  useEffect(() => {
    const fetchRoomsAndEvents = async () => {
      try {
        // Fetch rooms
        const roomResponse = await fetch('/api/rooms');
        if (!roomResponse.ok) throw new Error('Failed to fetch rooms');
        const roomData = await roomResponse.json();
        setRooms(roomData.rooms);

        // Fetch existing events
        const eventResponse = await fetch('/api/events');
        if (!eventResponse.ok) throw new Error('Failed to fetch events');
        const eventData = await eventResponse.json();
        setEvents(eventData.events);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRoomsAndEvents();
  }, []);

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
      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        });
        if (!response.ok) throw new Error('Failed to save event');
        const savedEvent = await response.json();
        setEvents([...events, savedEvent]); // Add new event to the calendar
        setOpenModal(false);
        setConflictAlert({ open: true, message: 'Exam successfully scheduled!' });
      } catch (error) {
        console.error('Error saving event:', error);
        setConflictAlert({ open: true, message: 'Failed to schedule the exam.' });
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Professor Exam Scheduling
      </Typography>

      {/* Calendar View */}
      <CalendarView events={events} onSelectSlot={handleSlotSelect} />

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
