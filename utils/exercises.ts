import fs from 'fs';
import path from 'path';

interface Exercise {
  name: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  baselineStrengthRatio: number;
  alternatives: string[];
}

const getExercises = (): Exercise[] => {
  const filePath = path.join('data', 'exercises.json');
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const exercises: Exercise[] = JSON.parse(fileContent);
    return exercises;
  } catch (error) {
    console.error('Error reading or parsing exercises.json:', error);
    return [];
  }
};

export default getExercises;