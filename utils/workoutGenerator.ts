import getExercises from './exercises';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

interface ExerciseData {
  name: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  baselineStrengthRatio: number;
  alternatives: string[];
}

function generateWorkout(
  timeAvailable: number,
  equipment: string[],
  goal: string,
  userExperience: string
): Exercise[] {
  const allExercises: ExerciseData[] = getExercises();
  const availableExercises = allExercises.filter((exercise) =>
    exercise.equipment.every((eq) => equipment.includes(eq))
  );

  const workout: Exercise[] = [];

  // Basic warm-up
  workout.push({ name: 'Warm-up: 5 minutes of light cardio', sets: 1, reps: 1, rest: 0 });

  // Select exercises based on goal and equipment
  const selectedExercises: ExerciseData[] = [];
  if (goal === 'lose weight') {
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('legs'))
      .slice(0,1)
    );
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('chest'))
      .slice(0,1)
    );
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('back'))
      .slice(0,1)
    );
  } else if (goal === 'build muscle') {
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('legs'))
      .slice(0,1)
    );
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('chest'))
      .slice(0,1)
    );
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('back'))
      .slice(0,1)
    );
  } else if (goal === 'gain strength') {
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('legs'))
      .slice(0,1)
    );
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('chest'))
      .slice(0,1)
    );
    selectedExercises.push(
      ...availableExercises.filter((exercise) => exercise.muscleGroups.includes('back'))
      .slice(0,1)
    );
  }

  // Assign sets, reps, and rest times based on goal and experience
  selectedExercises.forEach((exercise) => {
    let sets = 3;
    let reps = 10;
    let rest = 60;

    if (goal === 'lose weight') {
      reps = 12;
      rest = 45;
    } else if (goal === 'build muscle') {
      sets = 4;
      reps = 10;
      rest = 75;
    } else if (goal === 'gain strength') {
      sets = 5;
      reps = 5;
      rest = 105;
    }

    workout.push({ name: exercise.name, sets, reps, rest });
  });

  // Basic cool-down
  workout.push({ name: 'Cool-down: 5 minutes of stretching', sets: 1, reps: 1, rest: 0 });

  return workout;
}

export default generateWorkout;