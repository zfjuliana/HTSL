import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ExamTable from '@/components/examList';
import AddExamModal from '@/components/addExamModal';
import AlertSnackbar from '@/components/alertSnackBar';


//  For the admin (or a departmental coordinator) to oversee the creation and 
// optimization of the entire exam schedule, ensuring that conflicts are minimized.

const ScheduleCreator = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const courses = ['ECE 301', 'ECE 302', 'ECE 401'];
  const rooms = ['Room 101', 'Room 202', 'Room 303'];

  const handleAddExam = (newExam: { course: string; date: string; duration: number; room: string }) => {
    // Conflict detection (for simplicity, just checking room availability)
    const conflict = exams.find(
      (exam) => new Date(exam.date).toDateString() === new Date(newExam.date).toDateString() && exam.room === newExam.room
    );

    if (conflict) {
      setAlert({ open: true, message: 'Conflict detected: Room already booked!', severity: 'error' });
      return;
    }

    setExams([...exams, newExam]);
    setAlert({ open: true, message: 'Exam scheduled successfully!', severity: 'success' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Schedule Creator
      </Typography>
      <ExamTable exams={exams} />
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
        Add Exam
      </Button>
      <AddExamModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleAddExam}
        courses={courses}
        rooms={rooms}
      />
      <AlertSnackbar open={alert.open} message={alert.message} severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })} />
    </Box>
  );
};

export default ScheduleCreator;
