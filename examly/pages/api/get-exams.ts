import { NextApiRequest, NextApiResponse } from 'next';
import { exams, timeSlots, rooms } from '../../data/data.js';
import _ from 'lodash';

// Constants
const POPULATION_SIZE = 105;
const MAX_GENERATIONS = 100;
const MUTATION_RATE = 0.01;
const minimalExamsPerWeek = 2;

// Updated `generateRandomSchedule` function
function generateRandomSchedule() {
    return exams.map((exam) => {
      const validRooms = exam.possibleRooms.filter((roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        return room ? room.capacity >= exam.enrolledStudents.length : false;
      });
  
      const assignedRoom = validRooms.length > 0 ? _.sample(validRooms) : undefined;
      const assignedTimeSlot = exam.possibleTimeSlots.length > 0 ? _.sample(exam.possibleTimeSlots) : undefined;
  
      return {
        examId: exam.id,
        assignedTimeSlot,
        assignedRoom,
      };
    });
  }
function generateInitialPopulation() {
  return Array.from({ length: POPULATION_SIZE }, generateRandomSchedule);
}
// Updated `calculateFitness` function
function calculateFitness(schedule: any[]) {
    let fitness = 0;
    const studentExamMap: { [key: string]: string[] } = {};
  
    schedule.forEach((examAssignment) => {
      const exam = exams.find((e) => e.id === examAssignment.examId);
      const room = rooms.find((r) => r.id === examAssignment.assignedRoom);
  
      if (!exam) {
        fitness -= 1000; // Penalty for invalid exam assignment
        return;
      }
  
      if (!room) {
        fitness -= 1000; // Penalty for invalid room assignment
        return;
      }
  
      if (room.capacity < exam.enrolledStudents.length) {
        fitness -= 1000; // Penalty for capacity constraint violation
      }
  
      exam.enrolledStudents.forEach((studentId) => {
        if (!studentExamMap[studentId]) studentExamMap[studentId] = [];
        studentExamMap[studentId].push(examAssignment.assignedTimeSlot);
      });
    });
  
    Object.values(studentExamMap).forEach((timeSlots) => {
      const timeSlotCounts = _.countBy(timeSlots);
  
      for (const count of Object.values(timeSlotCounts)) {
        if (count > 1) fitness -= 1000 * (count - 1); // Overlapping exams penalty
      }
    });
  
    return fitness;
  }
  

function evolvePopulation(population: any[]) {
  const parents = population.sort((a, b) => calculateFitness(b) - calculateFitness(a)).slice(0, population.length / 2);

  const newPopulation: any[] = [];
  while (newPopulation.length < population.length) {
    const parent1 = _.sample(parents);
    const parent2 = _.sample(parents);

    const child = parent1.map((gene: any, idx: number) =>
      Math.random() < 0.5 ? gene : parent2[idx]
    );

    newPopulation.push(
      child.map((gene: any) =>
        Math.random() < MUTATION_RATE
          ? {
              ...gene,
              assignedRoom: _.sample(exams.find((e) => e.id === gene.examId)?.possibleRooms),
              assignedTimeSlot: _.sample(exams.find((e) => e.id === gene.examId)?.possibleTimeSlots),
            }
          : gene
      )
    );
  }

  return newPopulation;
}

function runGA() {
  let population = generateInitialPopulation();
  let bestSchedule = null;
  let bestFitness = -Infinity;

  for (let i = 0; i < MAX_GENERATIONS; i++) {
    population = evolvePopulation(population);

    for (const schedule of population) {
      const fitness = calculateFitness(schedule);
      if (fitness > bestFitness) {
        bestFitness = fitness;
        bestSchedule = schedule;
      }
    }
  }

  return bestSchedule;
}

function generateStudentTimetables(schedule: any[]) {
  const studentTimetables: { [key: string]: any[] } = {};

  schedule.forEach((examAssignment) => {
    const exam = exams.find((e) => e.id === examAssignment.examId);

    exam?.enrolledStudents.forEach((studentId) => {
      if (!studentTimetables[studentId]) studentTimetables[studentId] = [];
      studentTimetables[studentId].push({
        examId: exam.id,
        timeSlot: examAssignment.assignedTimeSlot,
        roomId: examAssignment.assignedRoom,
      });
    });
  });

  for (const exams of Object.values(studentTimetables)) {
    exams.sort((a: any, b: any) => new Date(a.timeSlot).getTime() - new Date(b.timeSlot).getTime());
  }

  return studentTimetables;
}

function calculateStudentStress(studentTimetables: { [key: string]: any[] }) {
  const stressIndicators: { [key: string]: { stressScore: number; exams: any[] } } = {};

  Object.entries(studentTimetables).forEach(([studentId, exams]) => {
    let stressScore = 0;

    const days = _.groupBy(exams, (exam: any) => exam.timeSlot.split(' ')[0]);
    Object.values(days).forEach((dayExams) => {
      if (dayExams.length > 1) stressScore += (dayExams.length - 1) * 10; // Penalty for multiple exams in a day
    });

    stressIndicators[studentId] = {
      stressScore,
      exams,
    };
  });

  return stressIndicators;
}

// API Endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const schedule = runGA();
  
      // Handle null schedule
      if (!schedule) {
        return res.status(500).json({ message: 'Failed to generate a valid schedule.' });
      }
  
      const studentTimetables = generateStudentTimetables(schedule);
      const stressIndicators = calculateStudentStress(studentTimetables);
  
      return res.status(200).json({
        optimizedSchedule: schedule,
        studentTimetables,
        stressIndicators,
      });
    }
  
    res.status(405).json({ message: 'Method not allowed' });
  }