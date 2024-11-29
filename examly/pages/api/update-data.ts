import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Path to the data file
const dataFilePath = path.join(process.cwd(), 'data.js');

type ExamPayload = {
  id: string;
  course: string;
  possibleRooms: string[];
  possibleTimeSlots: string[];
  enrolledStudents: string[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, course, possibleRooms, possibleTimeSlots, enrolledStudents }: ExamPayload = req.body;

    if (!id || !course || !possibleRooms || !possibleTimeSlots || !enrolledStudents) {
      return res.status(400).json({
        message: 'Missing required fields: id, course, possibleRooms, possibleTimeSlots, enrolledStudents',
      });
    }

    try {
      // Read the current data file
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      const data = eval(fileContent); // Load existing data safely

      // Create the new exam object
      const newExam = {
        id,
        course,
        possibleRooms,
        possibleTimeSlots,
        enrolledStudents,
      };

      // Add the new exam to the exams array
      if (!data.exams) {
        data.exams = [];
      }
      data.exams.push(newExam);

      // Write the updated data back to the file
      const updatedContent = `
export const rooms = ${JSON.stringify(data.rooms, null, 2)};
export const timeSlots = ${JSON.stringify(data.timeSlots, null, 2)};
export const students = ${JSON.stringify(data.students, null, 2)};
export const studentCourseAssignments = ${JSON.stringify(data.studentCourseAssignments, null, 2)};
export const exams = ${JSON.stringify(data.exams, null, 2)};
      `;

      fs.writeFileSync(dataFilePath, updatedContent, 'utf-8');

      return res.status(200).json({ message: 'Exam added successfully', newExam });
    } catch (error) {
      console.error('Error updating data file:', error);
      return res.status(500).json({ message: 'Failed to update data'});
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
