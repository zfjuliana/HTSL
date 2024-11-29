import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

interface ExamEvent {
  title: string;
  date: string;
  location: string;
  userType: 'professor' | 'student';
}

const ExamCalendar: React.FC = () => {
  const [events, setEvents] = useState<ExamEvent[]>([]);

  useEffect(() => {
    // Fetch exam schedule data from the backend
    // RYAN DOUBLE CHECK: 
    fetch('/api/get-exams')
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((exam: any) => ({
          title: `${exam.course_name} - ${exam.location}`,
          date: exam.date,
          location: exam.location,
          userType: exam.user_type,
        }));
        setEvents(formattedEvents);
      });
  }, []);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.title,
          date: event.date,
          extendedProps: { userType: event.userType },
        }))}
      />
    </div>
  );
};

export default ExamCalendar;
