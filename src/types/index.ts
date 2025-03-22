// User information
export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'strength'
  | 'endurance'
  | 'maintenance';
export type ExperienceLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';
export type MeasurementSystem = 'metric' | 'imperial';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  height: number; // cm or inches based on measurement system
  weight: number; // kg or lbs based on measurement system
  measurementSystem: MeasurementSystem;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  recoveryRate: number; // 1-10 scale
  availableEquipment: string[];
  workoutsPerWeek: number;
  timePerWorkout: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

// Exercise related types
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'traps'
  | 'lats'
  | 'core'
  | 'full_body';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'resistance_band'
  | 'medicine_ball'
  | 'stability_ball'
  | 'foam_roller'
  | 'bench'
  | 'pull_up_bar'
  | 'trx'
  | 'other';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  primaryMuscleGroups: MuscleGroup[];
  secondaryMuscleGroups: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: ExerciseDifficulty;
  alternativeExercises: string[]; // IDs of alternative exercises
  baselineStrengthRatio: number; // Relative to bodyweight
  videoUrl?: string;
  imageUrl?: string;
  instructions: string[];
  tips: string[];
  unilateral: boolean; // One side at a time (e.g., lunges)
}

// Workout related types
export type RPE = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // Rate of Perceived Exertion

export interface Set {
  reps: number;
  weight: number; // kg or lbs
  rpe?: RPE;
  isWarmup: boolean;
  completed: boolean;
  actualReps?: number; // Actual reps completed
  actualWeight?: number; // Actual weight used
  actualRPE?: RPE; // Actual RPE reported
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: Set[];
  restBetweenSets: number; // seconds
  tempoString?: string; // e.g., "3-1-2-0" for eccentric-bottom-concentric-top
  notes?: string;
  superset?: string; // ID of exercise it's supersetted with
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  exercises: WorkoutExercise[];
  date: Date;
  duration: number; // minutes
  notes?: string;
  completed: boolean;
  weekInCycle: number; // 1-4 for periodization
  cycleNumber: number;
  type: 'strength' | 'hypertrophy' | 'endurance' | 'deload';
}

// Weight calculation and progression
export interface WeightCalculation {
  userId: string;
  exerciseId: string;
  baselineWeight: number;
  currentWeight: number;
  progressionRate: number; // % increase per week
  lastUpdated: Date;
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  requirement: {
    type: 'strength_milestone' | 'consistency' | 'volume' | 'streak';
    value: number;
    exerciseId?: string;
  };
}
