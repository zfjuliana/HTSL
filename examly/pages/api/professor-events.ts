import { NextApiRequest, NextApiResponse } from 'next';

interface Event {
    title: string;
    start: string; // ISO 8601 format (e.g., '2024-12-01T10:00:00')
    end: string;
    room: string;
}

// In-memory storage for professor events
let professorEvents: Event[] = [];

// Fetch the optimized schedule from the `get-exams` endpoint
async function fetchOptimizedSchedule() {
    try {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/get-exams`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch optimized schedule: ${response.statusText}`);
        }

        const data = await response.json();
        return data.optimizedSchedule; // Assuming optimizedSchedule contains exam details
    } catch (error) {
        console.error('Error fetching optimized schedule:', error);
        throw error;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Fetch the optimized schedule
            const optimizedSchedule = await fetchOptimizedSchedule();

            if (!optimizedSchedule || !Array.isArray(optimizedSchedule)) {
                return res.status(500).json({ error: 'Invalid optimized schedule format' });
            }

            // Convert optimized schedule to events
            professorEvents = optimizedSchedule.map((exam: any) => ({
                examId: exam.examId || exam.id, // Use examId or fallback to id
                title: `Exam: ${exam.examId || exam.id}`,
                start: exam.assignedTimeSlot,
                end: new Date(new Date(exam.assignedTimeSlot).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                assignedTimeSlot: exam.assignedTimeSlot,
                assignedRoom: exam.assignedRoom,
                room: exam.assignedRoom,
            }));

            // Return the scheduled events
            return res.status(200).json({ professorEvents });
        } catch (error) {
            console.error('Error scheduling events:', error);
            return res.status(500).json({ error: 'Failed to schedule professor events' });
        }
    }

    // Handle unsupported methods
    return res.status(405).json({ error: 'Method Not Allowed' });
}
