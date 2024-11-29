import React, { useState } from 'react';
import { Modal, Box, Grid, TextField, Button, Typography } from '@mui/material';

type AddExamModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (exam: { course: string; date: string; duration: number; room: string }) => void;
  courses: string[];
  rooms: string[];
};

const AddExamModal: React.FC<AddExamModalProps> = ({ open, onClose, onSave, courses, rooms }) => {
  const [newExam, setNewExam] = useState({ course: '', date: '', duration: 1, room: '' });

  const handleSave = () => {
    onSave(newExam);
    setNewExam({ course: '', date: '', duration: 1, room: '' });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Schedule an Exam
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course"
              select
              SelectProps={{ native: true }}
              value={newExam.course}
              onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
            >
              <option value="">Select a Course</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Date and Time"
              InputLabelProps={{ shrink: true }}
              value={newExam.date}
              onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Duration (hours)"
              InputProps={{ inputProps: { min: 1 } }}
              value={newExam.duration}
              onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value, 10) })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room"
              select
              SelectProps={{ native: true }}
              value={newExam.room}
              onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
            >
              <option value="">Select a Room</option>
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button variant="contained" onClick={handleSave}>
              Save Exam
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddExamModal;
