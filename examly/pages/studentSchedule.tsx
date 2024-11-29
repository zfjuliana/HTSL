import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import AlertSnackbar from '@/components/alertSnackBar'; // Snackbar for conflict alerts
import { useRouter } from 'next/router';
import { ArrowBack } from '@mui/icons-material';

const StudentSchedule = () => {
  const router = useRouter();
  // Sample students data
  const studentsData = [
    { id: 'student1', name: 'Student 1' },
    { id: 'student2', name: 'Student 2' },
    { id: 'student3', name: 'Student 3' },
    { id: 'student4', name: 'Student 4' },
    { id: 'student5', name: 'Student 5' },
    // ... add more students as needed
  ];

  // State to hold the selected student
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string }>(studentsData[0]);

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

  // Handle student selection change
  const handleStudentChange = (event: SelectChangeEvent<string>) => {
    const studentId = event.target.value;
    const student = studentsData.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
    }
  };

  // Function to detect schedule conflicts
  const detectConflicts = (exams: any[]) => {
    const conflicts: any[] = [];
    for (let i = 0; i < exams.length; i++) {
      for (let j = i + 1; j < exams.length; j++) {
        const start1 = new Date(exams[i].date).getTime();
        const end1 = start1 + exams[i].duration * 60 * 60 * 1000;
        const start2 = new Date(exams[j].date).getTime();
        const end2 = start2 + exams[j].duration * 60 * 60 * 1000;

        if (start1 < end2 && end1 > start2) {
          conflicts.push([exams[i], exams[j]]);
        }
      }
    }
    return conflicts;
  };

  // Fetch timetable data from the API
  const fetchExamData = async (studentId: string) => {
    try {
      console.log('Fetching timetable data from API.');
      const response = await fetch(`/api/student-events?studentId=${studentId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.statusText}`);
      }
      const data = await response.json();

      // Extract and transform the data for the selected student
      const studentExams = data.scheduledEvents || [];
      const transformedExams = studentExams.map((exam: any) => ({
        course: exam.title.replace('Exam: ', ''), // Assuming the title is like "Exam: CourseName"
        date: new Date(exam.start),
        duration:
          (new Date(exam.end).getTime() - new Date(exam.start).getTime()) / (60 * 60 * 1000), // Duration in hours
        room: exam.room,
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

  // Fetch data whenever the selected student changes
  useEffect(() => {
    if (selectedStudent && selectedStudent.id) {
      fetchExamData(selectedStudent.id);
    }
  }, [selectedStudent]);

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

      {/* Student Selection Dropdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h5"
            component="h2"
            color="primary"
            sx={{ fontWeight: 'bold', mb: 2, marginTop: '60px' }}
          >
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
        <Typography
          variant="h3"
          component="h1"
          color="primary"
          sx={{ fontWeight: 'bold', marginTop: '60px' }}
        >
          {selectedStudent.name}'s Midterm Exam Schedule
        </Typography>
      </Box>

      {/* FullCalendar to display exams */}
      <Paper sx={{ flex: 1, overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          initialDate="2024-01-01"
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
