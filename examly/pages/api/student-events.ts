import { NextApiRequest, NextApiResponse } from 'next';

// Fetch the student timetables from the `get-exams` endpoint
async function fetchStudentTimetables() {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/get-exams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch student timetables: ${response.statusText}`);
    }

    const data = await response.json();
    return data.studentTimetables; // Assuming `studentTimetables` exists in the response
  } catch (error) {
    console.error('Error fetching student timetables:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { studentId } = req.query;

    // Validate `studentId`
    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid studentId query parameter' });
    }

    try {
      // Fetch the student timetables
      const studentTimetables = await fetchStudentTimetables();

      // Validate the format of `studentTimetables`
      if (!studentTimetables || typeof studentTimetables !== 'object') {
        return res.status(500).json({ error: 'Invalid student timetables format' });
      }

      // Fetch the exams specific to the given studentId
      const studentExams = studentTimetables[studentId];

      // Check if the student has any exams
      if (!studentExams || studentExams.length === 0) {
        return res.status(404).json({ error: `No schedule found for student: ${studentId}` });
      }

      // Map the exams to scheduled events
      const scheduledEvents = studentExams.map((exam: any) => ({
        title: `Exam: ${exam.examId}`,
        start: exam.timeSlot, // Assuming `timeSlot` is in ISO8601 format
        end: new Date(new Date(exam.timeSlot).getTime() + 2 * 60 * 60 * 1000).toISOString(), // Adding 2 hours
        room: exam.roomId,
      }));

      // Return the response
      return res.status(200).json({ studentId, scheduledEvents });
    } catch (error) {
      console.error('Error creating student schedule:', error);
      return res.status(500).json({ error: 'Failed to fetch student events' });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method Not Allowed' });
}
