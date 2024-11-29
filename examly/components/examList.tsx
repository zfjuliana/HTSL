import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

type Exam = {
  course: string;
  date: string;
  duration: number;
  room: string;
};

type ExamTableProps = {
  exams: Exam[];
};

const ExamTable: React.FC<ExamTableProps> = ({ exams }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Duration (hours)</TableCell>
            <TableCell>Room</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exams.length > 0 ? (
            exams.map((exam, index) => (
              <TableRow key={index}>
                <TableCell>{exam.course}</TableCell>
                <TableCell>{new Date(exam.date).toLocaleString()}</TableCell>
                <TableCell>{exam.duration}</TableCell>
                <TableCell>{exam.room}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No exams scheduled
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExamTable;
