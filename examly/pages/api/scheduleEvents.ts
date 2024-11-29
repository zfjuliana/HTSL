// pages/api/events.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface Event {
  title: string;
  start: string; // ISO 8601 string format (e.g., '2024-12-01T10:00:00')
  end: string;
  room: string;
}

// In-memory storage for events (you can replace this with a database in production)
let events: Event[] = [
  // Sample event for demonstration
  {
    title: 'Sample Exam',
    start: '2024-12-01T10:00:00',
    end: '2024-12-01T12:00:00',
    room: 'Room 101',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return the list of events
    return res.status(200).json({ events });
  }

  if (req.method === 'POST') {
    // Handle new event creation
    const { title, start, end, room } = req.body;

    // Check for required fields
    if (!title || !start || !end || !room) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for conflicts (room already booked)
    const conflict = events.some(
      (event) =>
        event.room === room &&
        new Date(event.start).getTime() < new Date(end).getTime() &&
        new Date(event.end).getTime() > new Date(start).getTime()
    );

    if (conflict) {
      return res.status(400).json({ error: 'Room is already booked for the selected time' });
    }

    // Add the new event to the events array
    const newEvent: Event = { title, start, end, room };
    events.push(newEvent);

    // Return the newly added event
    return res.status(201).json(newEvent);
  }

  // Handle other methods
  res.status(405).json({ error: 'Method Not Allowed' });
}
