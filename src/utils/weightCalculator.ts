import {
  ExperienceLevel,
  FitnessGoal,
  Gender,
  MeasurementSystem,
} from '@/types';

/**
 * Calculate the baseline recommended weight for an exercise based on user profile
 */
export const calculateBaselineWeight = (
  exerciseBaselineRatio: number, // Baseline strength ratio relative to bodyweight
  userWeight: number, // User's bodyweight in kg or lbs
  gender: Gender,
  age: number,
  experienceLevel: ExperienceLevel,
  measurementSystem: MeasurementSystem
): number => {
  // Start with basic ratio calculation
  let recommendedWeight = userWeight * exerciseBaselineRatio;

  // Apply gender factor (biological considerations)
  const genderFactor = gender === 'male' ? 1.0 : 0.8; // Average strength differences
  recommendedWeight *= genderFactor;

  // Apply age factor (strength tends to decrease with age after ~30)
  let ageFactor = 1.0;
  if (age > 30) {
    // Reduce by 0.5% per year after 30
    ageFactor = 1.0 - (age - 30) * 0.005;
  } else if (age < 18) {
    // Reduce for developing bodies
    ageFactor = 0.8;
  }
  recommendedWeight *= ageFactor;

  // Apply experience level factor
  const experienceFactor = {
    beginner: 0.6,
    intermediate: 0.8,
    advanced: 1.0,
    expert: 1.2,
  }[experienceLevel];

  recommendedWeight *= experienceFactor;

  // Round to appropriate increment based on measurement system
  if (measurementSystem === 'metric') {
    // Round to nearest 2.5kg
    recommendedWeight = Math.round(recommendedWeight / 2.5) * 2.5;
  } else {
    // Round to nearest 5lbs
    recommendedWeight = Math.round(recommendedWeight / 5) * 5;
  }

  return recommendedWeight;
};

/**
 * Adjust weight based on fitness goal
 */
export const adjustWeightForGoal = (
  baseWeight: number,
  fitnessGoal: FitnessGoal
): number => {
  const goalAdjustments = {
    weight_loss: 0.8, // Lower weight, higher reps for endurance
    muscle_gain: 0.9, // Moderate weight in hypertrophy range
    strength: 1.1, // Higher weight for strength development
    endurance: 0.7, // Lower weight for endurance
    maintenance: 1.0, // Maintain current strength levels
  };

  return baseWeight * goalAdjustments[fitnessGoal];
};

/**
 * Calculate progression over time
 */
export const calculateProgression = (
  currentWeight: number,
  experienceLevel: ExperienceLevel,
  successRate: number, // 0-1, percentage of successful sets
  rpe: number, // Rate of Perceived Exertion 1-10
  measurementSystem: MeasurementSystem
): number => {
  // Base progression rates by experience level (per week)
  const baseProgressionRates = {
    beginner: 0.05, // 5% per week
    intermediate: 0.025, // 2.5% per week
    advanced: 0.0125, // 1.25% per week
    expert: 0.00625, // 0.625% per week
  };

  let progressionRate = baseProgressionRates[experienceLevel];

  // Adjust based on RPE (Rate of Perceived Exertion)
  // If RPE is too low, increase progression; if too high, decrease
  if (rpe < 7) {
    progressionRate *= 1.2; // Increase progression if exercise is too easy
  } else if (rpe > 8) {
    progressionRate *= 0.8; // Decrease progression if exercise is too difficult
  }

  // Adjust based on success rate
  if (successRate < 0.8) {
    progressionRate *= 0.75; // Significant decrease if failing sets
  } else if (successRate > 0.95) {
    progressionRate *= 1.2; // Increase if very successful
  }

  // Calculate the weight increase
  let weightIncrease = currentWeight * progressionRate;

  // Round to appropriate increment
  if (measurementSystem === 'metric') {
    // Round to nearest 1kg or 2.5kg based on weight
    const increment = currentWeight < 20 ? 1 : 2.5;
    weightIncrease = Math.round(weightIncrease / increment) * increment;
  } else {
    // Round to nearest 2.5lbs or 5lbs based on weight
    const increment = currentWeight < 45 ? 2.5 : 5;
    weightIncrease = Math.round(weightIncrease / increment) * increment;
  }

  return currentWeight + weightIncrease;
};

/**
 * Calculate weight for a given set based on the target reps and RPE
 */
export const calculateSetWeight = (
  baseWeight: number,
  targetReps: number,
  targetRPE: number,
  isWarmup: boolean
): number => {
  if (isWarmup) {
    // Warmup sets are typically percentage of working weight
    // Progressive warmup protocol: 50%, 70%, 90% for three warmup sets
    if (targetReps > 8) return baseWeight * 0.5;
    if (targetReps > 5) return baseWeight * 0.7;
    return baseWeight * 0.9;
  }

  // Adjust weight based on rep range (using simplified Brzycki formula concepts)
  // For hypertrophy (8-12 reps), use base weight
  // For strength (1-5 reps), increase weight
  // For endurance (15+ reps), decrease weight
  let repFactor = 1.0;
  if (targetReps <= 5) {
    // Strength focus - increase weight
    repFactor = 1.1 + 0.02 * (5 - targetReps); // 1.12-1.2 factor for 1-5 reps
  } else if (targetReps >= 15) {
    // Endurance focus - decrease weight
    repFactor = 0.9 - 0.01 * (targetReps - 15); // 0.9-0.85 factor for 15-20 reps
  }

  // RPE adjustment (RPE 10 = 100% intensity, RPE 7 = ~90% intensity)
  const rpeFactor = 0.7 + targetRPE * 0.03;

  return baseWeight * repFactor * rpeFactor;
};
