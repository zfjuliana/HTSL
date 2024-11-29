import React from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Props definition for the CalendarView component
interface CalendarViewProps {
  events: Array<{
    title: string;
    start: Date;
    end: Date;
    room?: string;
  }>;
  onSelectSlot?: (slotInfo: SlotInfo) => void; // Optional for selectable calendar
}

const localizer = momentLocalizer(moment);

const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectSlot }) => {
  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        selectable={!!onSelectSlot} // Allow slot selection only if onSelectSlot is provided
        onSelectSlot={onSelectSlot}
        style={{ height: '100%', border: '1px solid #ddd', borderRadius: '8px' }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: '#007BFF',
            color: 'white',
            borderRadius: '4px',
            padding: '4px',
          },
        })}
        messages={{
          today: 'Today',
          previous: '<',
          next: '>',
          month: 'Month',
          week: 'Week',
          day: 'Day',
        }}
      />
    </div>
  );
};

export default CalendarView;
