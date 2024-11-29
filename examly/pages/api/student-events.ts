import { NextApiRequest, NextApiResponse } from 'next';

// Fetch the student timetables from the `get-exams` endpoint
async function fetchStudentTimetables() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL || ''}/api/get-exams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch student timetables: ${response.statusText}`);
    }

    const data = await response.json();
    return data.studentTimetables; // Assuming studentTimetables is part of the response
  } catch (error) {
    console.error('Error fetching student timetables:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { studentId } = req.query;

    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid studentId query parameter' });
    }

    try {
      // Fetch the student timetables
      const studentTimetables = await fetchStudentTimetables();

      if (!studentTimetables || typeof studentTimetables !== 'object') {
        return res.status(500).json({ error: 'Invalid student timetables format' });
      }

      // Get the student's exams
      const studentExams = studentTimetables[studentId];

      if (!studentExams || studentExams.length === 0) {
        return res.status(404).json({ error: `No schedule found for student: ${studentId}` });
      }

      // Create scheduled events from the student's timetable
      const scheduledEvents = studentExams.map((exam: any) => ({
        title: `Exam: ${exam.examId}`,
        start: exam.timeSlot, // Assuming timeSlot is in ISO8601 format
        end: new Date(new Date(exam.timeSlot).getTime() + 2 * 60 * 60 * 1000).toISOString(), // Adding 2 hours
        room: exam.roomId,
      }));

      return res.status(200).json({ studentId, scheduledEvents });
    } catch (error) {
      console.error('Error creating student schedule:', error);
      return res.status(500).json({ error: 'Failed to create student schedule' });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method Not Allowed' });
}
