import {
  Exercise,
  ExperienceLevel,
  FitnessGoal,
  MuscleGroup,
  WorkoutExercise,
  RPE,
  Set,
} from '@/types';

type AvailableEquipment = string[];
type TimeDuration = number; // in minutes

interface GenerateWorkoutParams {
  goal: FitnessGoal;
  experience: ExperienceLevel;
  availableEquipment: AvailableEquipment;
  timeAvailable: TimeDuration;
  weekInCycle: number; // 1-4 for periodization
  muscleGroupPreferences?: MuscleGroup[];
  excludedExercises?: string[];
}

// Definitions for different workout types
const workoutTypeDefinitions = {
  strength: {
    setsPerExercise: { min: 3, max: 5 },
    repsPerSet: { min: 3, max: 6 },
    restBetweenSets: { min: 180, max: 300 }, // seconds
    rpe: { min: 8, max: 10 },
  },
  hypertrophy: {
    setsPerExercise: { min: 3, max: 4 },
    repsPerSet: { min: 8, max: 12 },
    restBetweenSets: { min: 60, max: 120 },
    rpe: { min: 7, max: 9 },
  },
  endurance: {
    setsPerExercise: { min: 2, max: 3 },
    repsPerSet: { min: 15, max: 20 },
    restBetweenSets: { min: 30, max: 60 },
    rpe: { min: 6, max: 8 },
  },
  deload: {
    setsPerExercise: { min: 2, max: 3 },
    repsPerSet: { min: 8, max: 12 },
    restBetweenSets: { min: 60, max: 120 },
    rpe: { min: 5, max: 7 },
  },
};

// Map fitness goals to workout types priority
const goalToWorkoutTypePriority: Record<FitnessGoal, string[]> = {
  strength: ['strength', 'hypertrophy', 'endurance', 'deload'],
  muscle_gain: ['hypertrophy', 'strength', 'endurance', 'deload'],
  weight_loss: ['endurance', 'hypertrophy', 'strength', 'deload'],
  endurance: ['endurance', 'hypertrophy', 'strength', 'deload'],
  maintenance: ['hypertrophy', 'strength', 'endurance', 'deload'],
};

// Map weekInCycle to workout type using basic periodization
const getWorkoutTypeForWeek = (
  goal: FitnessGoal,
  weekInCycle: number
): string => {
  // Every 4th week is a deload
  if (weekInCycle % 4 === 0) return 'deload';

  // Otherwise, use the priority based on goal
  const priority = goalToWorkoutTypePriority[goal];
  return priority[weekInCycle % 3]; // Rotate through top 3 priorities
};

// Function to select exercises based on equipment and muscle targets
const selectExercises = (
  availableExercises: Exercise[],
  availableEquipment: string[],
  targetMuscleGroups: MuscleGroup[],
  experienceLevel: ExperienceLevel,
  excludedExercises: string[] = [],
  maxExercises: number
): Exercise[] => {
  // Filter exercises by available equipment
  let filteredExercises = availableExercises.filter(
    exercise =>
      exercise.equipment.some(eq => availableEquipment.includes(eq)) &&
      !excludedExercises.includes(exercise.id)
  );

  // Filter by experience level (don't give advanced exercises to beginners)
  filteredExercises = filteredExercises.filter(exercise => {
    if (experienceLevel === 'beginner')
      return exercise.difficulty === 'beginner';
    if (experienceLevel === 'intermediate')
      return exercise.difficulty !== 'advanced';
    return true; // advanced and expert users can do any exercise
  });

  // Create a map of muscle groups to their exercises
  const muscleToExercises = new Map<MuscleGroup, Exercise[]>();

  // Group exercises by primary muscle
  targetMuscleGroups.forEach(muscleGroup => {
    muscleToExercises.set(
      muscleGroup,
      filteredExercises.filter(
        ex =>
          ex.primaryMuscleGroups.includes(muscleGroup) ||
          ex.secondaryMuscleGroups.includes(muscleGroup)
      )
    );
  });

  // Select exercises prioritizing primary muscles first
  const selectedExercises: Exercise[] = [];

  // First pass: Select one exercise for each target muscle group
  for (const muscleGroup of targetMuscleGroups) {
    const exercisesForMuscle = muscleToExercises.get(muscleGroup) || [];
    if (exercisesForMuscle.length > 0) {
      // Priority to exercises where this is a primary muscle
      const primaryExercises = exercisesForMuscle.filter(ex =>
        ex.primaryMuscleGroups.includes(muscleGroup)
      );

      if (primaryExercises.length > 0) {
        const selected =
          primaryExercises[Math.floor(Math.random() * primaryExercises.length)];
        if (!selectedExercises.some(ex => ex.id === selected.id)) {
          selectedExercises.push(selected);
        }
      } else if (exercisesForMuscle.length > 0) {
        const selected =
          exercisesForMuscle[
            Math.floor(Math.random() * exercisesForMuscle.length)
          ];
        if (!selectedExercises.some(ex => ex.id === selected.id)) {
          selectedExercises.push(selected);
        }
      }
    }
  }

  // Second pass: Fill up to maxExercises with remaining good choices
  while (selectedExercises.length < maxExercises) {
    // Create a pool of remaining exercises not yet selected
    const remainingExercises = filteredExercises.filter(
      ex => !selectedExercises.some(selected => selected.id === ex.id)
    );

    if (remainingExercises.length === 0) break;

    // Randomly select from remaining
    const selected =
      remainingExercises[Math.floor(Math.random() * remainingExercises.length)];
    selectedExercises.push(selected);
  }

  return selectedExercises.slice(0, maxExercises);
};

// Generate workout sets for an exercise based on workout type
const generateSetsForExercise = (
  exercise: Exercise,
  workoutType: string
): { sets: number; reps: number; rest: number; rpe: RPE } => {
  const typeDefinition =
    workoutTypeDefinitions[workoutType as keyof typeof workoutTypeDefinitions];

  // Calculate values within the ranges
  const sets = Math.floor(
    Math.random() *
      (typeDefinition.setsPerExercise.max -
        typeDefinition.setsPerExercise.min +
        1) +
      typeDefinition.setsPerExercise.min
  );

  const reps = Math.floor(
    Math.random() *
      (typeDefinition.repsPerSet.max - typeDefinition.repsPerSet.min + 1) +
      typeDefinition.repsPerSet.min
  );

  const rest = Math.floor(
    Math.random() *
      (typeDefinition.restBetweenSets.max -
        typeDefinition.restBetweenSets.min +
        1) +
      typeDefinition.restBetweenSets.min
  );

  // Convert raw number to valid RPE type (1-10)
  const rawRpe = Math.floor(
    Math.random() * (typeDefinition.rpe.max - typeDefinition.rpe.min + 1) +
      typeDefinition.rpe.min
  );

  // Ensure RPE is within valid range (1-10)
  const rpe = Math.min(Math.max(rawRpe, 1), 10) as RPE;

  return { sets, reps, rest, rpe };
};

// Determine optimal number of exercises based on time available
const calculateOptimalExerciseCount = (
  timeAvailable: TimeDuration,
  workoutType: string,
  experienceLevel: ExperienceLevel
): number => {
  const typeDefinition =
    workoutTypeDefinitions[workoutType as keyof typeof workoutTypeDefinitions];

  // Estimate average time per set based on rest times and execution time
  const avgSetTime = typeDefinition.restBetweenSets.min + 30; // seconds (rest + ~30s for execution)

  // Estimate time for warmup (minutes)
  const warmupTime = 5;

  // Estimate time for cooldown (minutes)
  const cooldownTime = 5;

  // Available time for exercises in seconds
  const availableExerciseTime =
    (timeAvailable - warmupTime - cooldownTime) * 60;

  // Average sets per exercise
  const avgSetsPerExercise =
    (typeDefinition.setsPerExercise.min + typeDefinition.setsPerExercise.max) /
    2;

  // Time per exercise in seconds
  const timePerExercise = avgSetsPerExercise * avgSetTime;

  // Calculate optimal count
  let optimalCount = Math.floor(availableExerciseTime / timePerExercise);

  // Adjust based on experience level
  if (experienceLevel === 'beginner') {
    optimalCount = Math.min(optimalCount, 5); // Cap for beginners
  } else if (experienceLevel === 'intermediate') {
    optimalCount = Math.min(optimalCount, 7); // Cap for intermediate
  } else {
    optimalCount = Math.min(optimalCount, 9); // Cap for advanced/expert
  }

  // Ensure at least 3 exercises if time allows
  return Math.max(3, optimalCount);
};

// Function to create a warmup protocol
const generateWarmup = (
  exerciseCount: number
): {
  name: string;
  duration: number;
  instructions: string[];
} => {
  // Dynamic warmup that scales with workout size
  const warmupDuration = Math.min(10, 5 + Math.floor(exerciseCount / 2));

  const warmupInstructions = [
    '5 minutes light cardio (jogging, jumping jacks, or stationary bike)',
    'Arm circles forward and backward (10 each direction)',
    'Bodyweight squats (15 reps)',
    'Walking lunges (10 per leg)',
    'Push-ups (10 reps)',
    'Light stretching for major muscle groups (30 seconds each)',
  ];

  return {
    name: 'Dynamic Warm-up',
    duration: warmupDuration,
    instructions: warmupInstructions,
  };
};

// Function to create a cooldown protocol
const generateCooldown = (): {
  name: string;
  duration: number;
  instructions: string[];
} => {
  return {
    name: 'Cooldown & Stretching',
    duration: 5,
    instructions: [
      '2 minutes very light cardio to gradually reduce heart rate',
      'Static stretching for all major muscle groups (30-45 seconds each)',
      'Focus on muscles worked during the session',
      'Deep breathing to promote recovery and relaxation',
    ],
  };
};

// Main workout generation function
export const generateWorkout = (
  params: GenerateWorkoutParams,
  availableExercises: Exercise[]
): {
  exercises: WorkoutExercise[];
  workoutType: string;
  warmup: { name: string; duration: number; instructions: string[] };
  cooldown: { name: string; duration: number; instructions: string[] };
  estimatedDuration: number;
} => {
  const {
    goal,
    experience,
    availableEquipment,
    timeAvailable,
    weekInCycle,
    muscleGroupPreferences = [],
    excludedExercises = [],
  } = params;

  // Determine workout type based on goal and week in cycle
  const workoutType = getWorkoutTypeForWeek(goal, weekInCycle);

  // Determine target muscle groups
  let targetMuscleGroups: MuscleGroup[] = [];

  if (muscleGroupPreferences.length > 0) {
    // User has preferences
    targetMuscleGroups = muscleGroupPreferences;
  } else {
    // Default splits based on days per week (assuming rotation)
    targetMuscleGroups = [
      'chest',
      'back',
      'shoulders',
      'biceps',
      'triceps',
      'quads',
      'hamstrings',
      'glutes',
      'calves',
      'abs',
    ] as MuscleGroup[];
  }

  // Calculate optimal exercise count
  const optimalExerciseCount = calculateOptimalExerciseCount(
    timeAvailable,
    workoutType,
    experience
  );

  // Select exercises
  const selectedExercises = selectExercises(
    availableExercises,
    availableEquipment,
    targetMuscleGroups,
    experience,
    excludedExercises,
    optimalExerciseCount
  );

  // Generate workout exercises with sets
  const workoutExercises: WorkoutExercise[] = selectedExercises.map(
    exercise => {
      const { sets, reps, rest, rpe } = generateSetsForExercise(
        exercise,
        workoutType
      );

      // Create sets array with empty sets
      const setsArray: Set[] = Array(sets)
        .fill(null)
        .map(() => ({
          reps,
          weight: 0, // Will be calculated later based on user profile
          rpe,
          isWarmup: false,
          completed: false,
        }));

      // Add warmup sets for compound movements
      if (
        exercise.primaryMuscleGroups.length > 1 ||
        exercise.primaryMuscleGroups.includes('back') ||
        exercise.primaryMuscleGroups.includes('chest') ||
        exercise.primaryMuscleGroups.includes('quads')
      ) {
        // Add 2 warmup sets before working sets
        setsArray.unshift(
          {
            reps: reps + 5,
            weight: 0, // To be calculated as 50% of working weight
            rpe: 4 as RPE,
            isWarmup: true,
            completed: false,
          },
          {
            reps: reps + 2,
            weight: 0, // To be calculated as 75% of working weight
            rpe: 6 as RPE,
            isWarmup: true,
            completed: false,
          }
        );
      }

      return {
        exerciseId: exercise.id,
        sets: setsArray,
        restBetweenSets: rest,
        notes: '',
      };
    }
  );

  // Generate warmup and cooldown
  const warmup = generateWarmup(selectedExercises.length);
  const cooldown = generateCooldown();

  // Calculate estimated duration
  const exercisesDuration = workoutExercises.reduce((total, exercise) => {
    const setCount = exercise.sets.length;
    const setTime = exercise.restBetweenSets / 60; // Rest time in minutes
    return total + setCount * (setTime + 0.5); // 0.5 min per set execution
  }, 0);

  const estimatedDuration = Math.ceil(
    warmup.duration + exercisesDuration + cooldown.duration
  );

  return {
    exercises: workoutExercises,
    workoutType,
    warmup,
    cooldown,
    estimatedDuration,
  };
};
