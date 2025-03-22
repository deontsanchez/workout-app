import {
  ExperienceLevel,
  FitnessGoal,
  RPE,
  Workout,
  WorkoutExercise,
} from '@/types';

interface PeriodizationCycle {
  weeks: {
    weekNumber: number;
    type: 'strength' | 'hypertrophy' | 'endurance' | 'deload';
    intensity: number; // Percentage of max effort (0.0-1.0)
    volume: {
      sets: { min: number; max: number };
      reps: { min: number; max: number };
    };
    rpe: { min: RPE; max: RPE };
  }[];
}

// Standard 4-week periodization cycles based on goals
const periodizationCycles: Record<FitnessGoal, PeriodizationCycle> = {
  strength: {
    weeks: [
      {
        weekNumber: 1,
        type: 'hypertrophy',
        intensity: 0.75,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 8, max: 12 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 2,
        type: 'strength',
        intensity: 0.85,
        volume: { sets: { min: 4, max: 5 }, reps: { min: 4, max: 6 } },
        rpe: { min: 8, max: 9 },
      },
      {
        weekNumber: 3,
        type: 'strength',
        intensity: 0.9,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 2, max: 4 } },
        rpe: { min: 9, max: 10 },
      },
      {
        weekNumber: 4,
        type: 'deload',
        intensity: 0.65,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 6, max: 8 } },
        rpe: { min: 5, max: 7 },
      },
    ],
  },
  muscle_gain: {
    weeks: [
      {
        weekNumber: 1,
        type: 'hypertrophy',
        intensity: 0.75,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 8, max: 12 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 2,
        type: 'hypertrophy',
        intensity: 0.8,
        volume: { sets: { min: 4, max: 5 }, reps: { min: 8, max: 12 } },
        rpe: { min: 8, max: 9 },
      },
      {
        weekNumber: 3,
        type: 'strength',
        intensity: 0.85,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 6, max: 8 } },
        rpe: { min: 8, max: 9 },
      },
      {
        weekNumber: 4,
        type: 'deload',
        intensity: 0.65,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 10, max: 15 } },
        rpe: { min: 6, max: 7 },
      },
    ],
  },
  weight_loss: {
    weeks: [
      {
        weekNumber: 1,
        type: 'endurance',
        intensity: 0.65,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 15, max: 20 } },
        rpe: { min: 6, max: 7 },
      },
      {
        weekNumber: 2,
        type: 'hypertrophy',
        intensity: 0.7,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 10, max: 15 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 3,
        type: 'endurance',
        intensity: 0.7,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 15, max: 20 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 4,
        type: 'deload',
        intensity: 0.6,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 10, max: 15 } },
        rpe: { min: 5, max: 6 },
      },
    ],
  },
  endurance: {
    weeks: [
      {
        weekNumber: 1,
        type: 'endurance',
        intensity: 0.65,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 15, max: 20 } },
        rpe: { min: 6, max: 7 },
      },
      {
        weekNumber: 2,
        type: 'endurance',
        intensity: 0.7,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 15, max: 20 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 3,
        type: 'hypertrophy',
        intensity: 0.75,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 8, max: 12 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 4,
        type: 'deload',
        intensity: 0.6,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 12, max: 15 } },
        rpe: { min: 5, max: 6 },
      },
    ],
  },
  maintenance: {
    weeks: [
      {
        weekNumber: 1,
        type: 'hypertrophy',
        intensity: 0.75,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 8, max: 12 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 2,
        type: 'strength',
        intensity: 0.8,
        volume: { sets: { min: 3, max: 4 }, reps: { min: 5, max: 8 } },
        rpe: { min: 7, max: 8 },
      },
      {
        weekNumber: 3,
        type: 'endurance',
        intensity: 0.7,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 12, max: 15 } },
        rpe: { min: 6, max: 7 },
      },
      {
        weekNumber: 4,
        type: 'deload',
        intensity: 0.65,
        volume: { sets: { min: 2, max: 3 }, reps: { min: 8, max: 12 } },
        rpe: { min: 5, max: 6 },
      },
    ],
  },
};

/**
 * Get the periodization week parameters based on the user's goal and current week
 */
export const getPeriodizationWeek = (
  goal: FitnessGoal,
  weekInCycle: number
) => {
  const cycleWeekIndex = (weekInCycle - 1) % 4;
  return periodizationCycles[goal].weeks[cycleWeekIndex];
};

/**
 * Calculate progression for an exercise based on performance
 */
export const calculateExerciseProgression = (
  exerciseHistory: WorkoutExercise[],
  experienceLevel: ExperienceLevel
): {
  progressionRate: number;
  recommendation: string;
  readiness: number; // 0-100, how ready the user is for progression
} => {
  if (exerciseHistory.length < 2) {
    return {
      progressionRate: 0,
      recommendation: 'Need more workout data to calculate progression',
      readiness: 0,
    };
  }

  // Get the most recent workouts
  const recentWorkouts = exerciseHistory.slice(-3);

  // Calculate success rate (percentage of completed sets that hit target reps)
  let totalSets = 0;
  let successfulSets = 0;
  let averageRPE = 0;
  let totalRPE = 0;
  let totalRPESets = 0;

  recentWorkouts.forEach(workout => {
    workout.sets
      .filter(set => !set.isWarmup && set.completed)
      .forEach(set => {
        totalSets++;
        if (set.actualReps && set.actualReps >= set.reps) {
          successfulSets++;
        }

        if (set.actualRPE) {
          totalRPE += set.actualRPE;
          totalRPESets++;
        }
      });
  });

  const successRate = totalSets > 0 ? successfulSets / totalSets : 0;
  averageRPE = totalRPESets > 0 ? totalRPE / totalRPESets : (7 as RPE);

  // Base progression rates by experience level (per workout)
  const baseProgressionRates = {
    beginner: 0.025, // 2.5% per workout
    intermediate: 0.015, // 1.5% per workout
    advanced: 0.0075, // 0.75% per workout
    expert: 0.005, // 0.5% per workout
  };

  let progressionRate = baseProgressionRates[experienceLevel];

  // Adjust based on success rate
  if (successRate < 0.7) {
    // Too difficult, reduce progression
    progressionRate *= 0.5;
  } else if (successRate > 0.9) {
    // Too easy, increase progression
    progressionRate *= 1.5;
  }

  // Adjust based on RPE
  if (averageRPE < 7) {
    progressionRate *= 1.2; // Too easy, increase progression
  } else if (averageRPE > 8) {
    progressionRate *= 0.8; // Too hard, decrease progression
  }

  // Calculate readiness score (0-100)
  const readiness = Math.min(
    100,
    Math.max(0, successRate * 70 + (10 - averageRPE) * 3)
  );

  // Generate recommendation
  let recommendation = '';
  if (readiness > 80) {
    recommendation = 'Ready for progression. Increase weight for next workout.';
  } else if (readiness > 60) {
    recommendation = 'Making progress. Continue with current weight.';
  } else if (readiness > 40) {
    recommendation = 'Adapting to current load. Focus on form and technique.';
  } else {
    recommendation =
      'Struggling with current weight. Consider reducing weight slightly.';
  }

  return {
    progressionRate,
    recommendation,
    readiness,
  };
};

/**
 * Analyze workout history to identify strengths and weaknesses
 */
export const analyzeWorkoutHistory = (
  workoutHistory: Workout[]
): {
  strongestMuscleGroups: string[];
  weakestMuscleGroups: string[];
  progressionTrend:
    | 'improving'
    | 'plateaued'
    | 'declining'
    | 'insufficient_data';
  consistencyScore: number; // 0-100
  recommendedFocus: string[];
} => {
  if (workoutHistory.length < 4) {
    return {
      strongestMuscleGroups: [],
      weakestMuscleGroups: [],
      progressionTrend: 'insufficient_data',
      consistencyScore: workoutHistory.length * 25,
      recommendedFocus: ['Build workout consistency', 'Focus on proper form'],
    };
  }

  // More detailed analysis would go here, using actual exercise data
  // This is a simplified placeholder implementation

  // In a real implementation, we would compare volume, intensity, etc.
  const progressionTrend: 'improving' | 'plateaued' | 'declining' = 'improving';

  // Calculate consistency score based on workout frequency and completion
  const consistencyScore = Math.min(100, workoutHistory.length * 5);

  return {
    strongestMuscleGroups: ['chest', 'triceps'],
    weakestMuscleGroups: ['back', 'hamstrings'],
    progressionTrend,
    consistencyScore,
    recommendedFocus: [
      'Increase back training volume',
      'Add dedicated hamstring exercises',
      'Maintain chest strength',
    ],
  };
};

/**
 * Generate parameters for a deload week
 */
export const generateDeloadParameters =
  (): // In a real implementation, this would use the recent workouts data
  // recentWorkouts: Workout[]
  {
    intensityReduction: number; // Percentage to reduce intensity (0.0-1.0)
    volumeReduction: number; // Percentage to reduce volume (0.0-1.0)
    focusAreas: string[]; // Areas to emphasize during deload
  } => {
    // In a real implementation, this would analyze:
    // - Recent training intensity
    // - Signs of fatigue/overtraining
    // - User recovery metrics
    // - Injury history

    return {
      intensityReduction: 0.3, // Reduce weights by 30%
      volumeReduction: 0.4, // Reduce sets/reps by 40%
      focusAreas: ['Mobility work', 'Active recovery', 'Technique refinement'],
    };
  };
