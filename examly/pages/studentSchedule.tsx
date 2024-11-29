import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import AlertSnackbar from '@/components/alertSnackBar'; // Snackbar for conflict alerts
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';

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
    severity: 'error' | 'success';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

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

  useEffect(() => {
    const conflicts = detectConflicts(exams);
    if (conflicts.length > 0) {
      setConflictAlert({
        open: true,
        message: `Conflict detected: ${conflicts.length} overlapping exams!`,
        severity: 'error',
      });
    }
  }, [exams]);

  const handleCloseAlert = () => {
    setConflictAlert((prevAlert) => ({ ...prevAlert, open: false }));
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f0f4f8', // Reverting to the original background color (lighter gray)
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      <div className="flex items-center justify-start px-6 md:px-12 pt-24 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] grid-rows-[0.3fr_0.8fr_0.7fr_1fr] md:grid-rows-[0.3fr_0.8fr_1fr_1.5fr] tracking-tighter mt-10 md:mt-0 -ml-2 md:-ml-0">
          {/* Title */}
          <div className="row-span-1 flex justify-start items-end text-blue-800">
            <div>
              <h1 className="text-6xl font-bold">Your Midterm Exam Schedule</h1>
            </div>
          </div>

          {/* FullCalendar */}
          <div className="row-span-1 md:[grid-area:2/1/3/2] mt-10 md:mt-[50px] flex justify-start items-end w-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              events={exams.map((exam) => ({
                title: `${exam.course} Exam`,
                start: exam.date,
                end: new Date(exam.date).setHours(new Date(exam.date).getHours() + exam.duration),
                description: exam.room,
                color: 'green',
              }))}
              eventClick={(info) => window.alert(`Exam Details: ${info.event.title}`)}
              height="80vh" // Make calendar larger by setting height
            />
          </div>

          {/* Snackbar for conflict alerts */}
          <Snackbar open={conflictAlert.open} autoHideDuration={4000} onClose={handleCloseAlert}>
            <AlertSnackbar
              open={conflictAlert.open}
              message={conflictAlert.message}
              severity={conflictAlert.severity}
              onClose={handleCloseAlert}
            />
          </Snackbar>

          {/* Dropdown Arrow Button */}
          <div className="row-span-1 flex justify-between md:justify-end items-end relative">
            <button
              type="button"
              onClick={() => console.log('Dropdown opened')}
              className="text-white text-3xl font-semibold bg-purple hover:bg-darkerpurple rounded-full w-16 h-16 relative flex items-center justify-center mb-5"
            >
              <FontAwesomeIcon icon={faArrowRight} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default StudentSchedule;
