import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const dataFilePath = path.join(process.cwd(), 'data/data.js');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        id,
        course,
        possibleDates,
        possibleRooms,
        possibleTimeSlots,
        enrolledStudents,
      } = req.body;

      // Validate input
      if (
        !id ||
        !course ||
        !Array.isArray(possibleDates) ||
        !Array.isArray(possibleRooms) ||
        !Array.isArray(possibleTimeSlots) ||
        !Array.isArray(enrolledStudents)
      ) {
        return res.status(400).json({
          message:
            'Missing or invalid fields. Required: id, course, possibleDates (array), possibleRooms (array), possibleTimeSlots (array), enrolledStudents (array)',
        });
      }

      // Read the data file content
      let fileContent;
      try {
        fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      } catch (error) {
        console.error('Failed to read data file:', error);
        return res.status(500).json({ message: 'Data file not found or inaccessible' });
      }

      // Extract the `exams` object from the file content
      const examsMatch = fileContent.match(/export const exams = (\[.*?\]);/s);
      if (!examsMatch) {
        return res.status(500).json({ message: 'Failed to parse exams data' });
      }

      // Sanitize the matched content for JSON compatibility
      let sanitizedExamsString = examsMatch[1]
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/,\s*]/, ']'); // Remove trailing commas before array end

      let exams;
      try {
        exams = JSON.parse(sanitizedExamsString);
      } catch (parseError) {
        console.error('Failed to parse sanitized exams data:', parseError);
        return res.status(500).json({ message: 'Invalid exams data format' });
      }

      // Add new exam
      const newExam = {
        id,
        course,
        possibleDates,
        possibleRooms,
        possibleTimeSlots,
        enrolledStudents,
      };

      exams.push(newExam);

      // Rebuild the data file content
      const updatedContent = `
export const rooms = ${JSON.stringify(eval(fileContent.match(/export const rooms = (\[.*?\]);/s)[1]), null, 2)};
export const timeSlots = ${JSON.stringify(eval(fileContent.match(/export const timeSlots = (\[.*?\]);/s)[1]), null, 2)};
export const students = ${JSON.stringify(eval(fileContent.match(/export const students = (\[.*?\]);/s)[1]), null, 2)};
export const studentCourseAssignments = ${JSON.stringify(eval(fileContent.match(/export const studentCourseAssignments = (\{.*?\});/s)[1]), null, 2)};
export const exams = ${JSON.stringify(exams, null, 2)};
      `;

      try {
        fs.writeFileSync(dataFilePath, updatedContent, 'utf-8');
      } catch (writeError) {
        console.error('Failed to write data file:', writeError);
        return res.status(500).json({ message: 'Failed to update data file' });
      }

      return res.status(200).json({ message: 'Exam added successfully', newExam });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'An unexpected error occurred' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
