import {
  Exercise,
  MuscleGroup,
  EquipmentType,
  ExerciseDifficulty,
} from '@/types';

// Generate consistent IDs for linking alternative exercises
const generateConsistentId = (name: string): string => {
  // Convert exercise name to a consistent ID
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Helper function to create exercise objects
const createExercise = (
  name: string,
  description: string,
  primary: MuscleGroup[],
  secondary: MuscleGroup[],
  equipment: EquipmentType[],
  difficulty: ExerciseDifficulty,
  baselineRatio: number,
  alternatives: string[] = [],
  unilateral: boolean = false,
  videoUrl?: string,
  imageUrl?: string
): Exercise => {
  const id = generateConsistentId(name);

  return {
    id,
    name,
    description,
    primaryMuscleGroups: primary,
    secondaryMuscleGroups: secondary,
    equipment,
    difficulty,
    alternativeExercises: alternatives,
    baselineStrengthRatio: baselineRatio,
    videoUrl,
    imageUrl,
    instructions: generateInstructions(name),
    tips: generateTips(name, primary, equipment),
    unilateral,
  };
};

// Generate basic instructions for exercises
const generateInstructions = (exerciseName: string): string[] => {
  // This would be more detailed in a real database
  if (exerciseName.includes('Squat')) {
    return [
      'Stand with feet shoulder-width apart',
      'Brace your core and keep chest up',
      'Bend knees and hips to lower your body',
      'Keep your weight on your heels',
      'Lower until thighs are parallel to ground (or as low as possible with good form)',
      'Drive through heels to return to standing position',
    ];
  } else if (exerciseName.includes('Bench Press')) {
    return [
      'Lie on bench with feet flat on floor',
      'Grip the bar slightly wider than shoulder width',
      'Unrack the bar and position it above chest',
      'Lower the bar to mid-chest level',
      'Press the bar back up to starting position',
    ];
  } else if (exerciseName.includes('Deadlift')) {
    return [
      'Stand with feet hip-width apart, barbell over mid-foot',
      'Bend at hips and knees, grip bar just outside legs',
      'Keep chest up, spine neutral',
      'Drive through heels, extending hips and knees',
      'Keep bar close to body throughout the movement',
      'Stand fully upright at the top, shoulders back',
    ];
  }

  // Generic instructions for other exercises
  return [
    'Set up with proper form and body alignment',
    'Brace core for stability throughout movement',
    'Perform the movement with controlled tempo',
    'Focus on muscle contraction during the exercise',
    'Complete the full range of motion if possible',
  ];
};

// Generate exercise tips
const generateTips = (
  exerciseName: string,
  primaryMuscles: MuscleGroup[],
  equipment: EquipmentType[]
): string[] => {
  const commonTips = [
    'Focus on mind-muscle connection',
    'Maintain proper breathing throughout',
    "Don't sacrifice form for heavier weight",
    'Control the eccentric (lowering) portion',
  ];

  const specificTips: string[] = [];

  // Add muscle-specific tips
  if (primaryMuscles.includes('chest')) {
    specificTips.push(
      'Focus on squeezing your chest at the top of the movement'
    );
  }

  if (primaryMuscles.includes('back')) {
    specificTips.push('Pull with your elbows, not your hands');
  }

  if (
    primaryMuscles.includes('quads') ||
    primaryMuscles.includes('hamstrings')
  ) {
    specificTips.push('Keep your knees tracking over your toes');
  }

  // Add equipment-specific tips
  if (equipment.includes('barbell')) {
    specificTips.push('Ensure even grip width on both sides of the barbell');
  }

  if (equipment.includes('dumbbell') && exerciseName.includes('Press')) {
    specificTips.push(
      'Using dumbbells allows for greater range of motion than a barbell'
    );
  }

  return [...commonTips, ...specificTips];
};

// Exercise Database
export const exercises: Exercise[] = [
  // COMPOUND BARBELL EXERCISES
  createExercise(
    'Barbell Back Squat',
    'A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.',
    ['quads', 'glutes'],
    ['hamstrings', 'core'],
    ['barbell'],
    'intermediate',
    1.5, // 1.5x bodyweight for average intermediate lifter
    ['front-squat', 'goblet-squat', 'hack-squat']
  ),

  createExercise(
    'Front Squat',
    'A squat variation that emphasizes the quadriceps with the barbell held across the front deltoids.',
    ['quads'],
    ['glutes', 'core', 'shoulders'],
    ['barbell'],
    'intermediate',
    1.2,
    ['back-squat', 'goblet-squat', 'hack-squat']
  ),

  createExercise(
    'Barbell Bench Press',
    'A compound upper body pushing exercise that primarily targets the chest.',
    ['chest'],
    ['triceps', 'shoulders'],
    ['barbell', 'bench'],
    'intermediate',
    1.0,
    ['dumbbell-bench-press', 'incline-bench-press', 'push-up']
  ),

  createExercise(
    'Incline Bench Press',
    'A bench press variation performed on an inclined bench to emphasize the upper chest.',
    ['chest'],
    ['shoulders', 'triceps'],
    ['barbell', 'bench'],
    'intermediate',
    0.8,
    ['dumbbell-incline-bench-press', 'barbell-bench-press']
  ),

  createExercise(
    'Barbell Deadlift',
    'A fundamental compound exercise that targets the posterior chain.',
    ['hamstrings', 'glutes', 'back'],
    ['quads', 'core', 'traps', 'forearms'],
    ['barbell'],
    'intermediate',
    1.75,
    ['romanian-deadlift', 'trap-bar-deadlift', 'sumo-deadlift']
  ),

  createExercise(
    'Romanian Deadlift',
    'A deadlift variation that emphasizes the hamstrings and glutes with less knee flexion.',
    ['hamstrings', 'glutes'],
    ['back', 'forearms'],
    ['barbell'],
    'intermediate',
    1.25,
    ['barbell-deadlift', 'stiff-leg-deadlift', 'good-morning']
  ),

  createExercise(
    'Barbell Row',
    'A compound pulling exercise for the back where the torso is bent forward.',
    ['back', 'lats'],
    ['biceps', 'shoulders', 'forearms'],
    ['barbell'],
    'intermediate',
    0.7,
    ['dumbbell-row', 'cable-row', 'pull-up']
  ),

  createExercise(
    'Overhead Press',
    'A vertical pressing movement that targets the shoulders.',
    ['shoulders'],
    ['triceps', 'traps', 'core'],
    ['barbell'],
    'intermediate',
    0.65,
    ['dumbbell-overhead-press', 'push-press', 'seated-barbell-press']
  ),

  // COMPOUND DUMBBELL EXERCISES
  createExercise(
    'Dumbbell Bench Press',
    'A bench press variation using dumbbells for more range of motion.',
    ['chest'],
    ['triceps', 'shoulders'],
    ['dumbbell', 'bench'],
    'beginner',
    0.8,
    ['barbell-bench-press', 'push-up', 'machine-chest-press']
  ),

  createExercise(
    'Dumbbell Row',
    'A unilateral back exercise performed with one arm at a time.',
    ['back', 'lats'],
    ['biceps', 'shoulders', 'forearms'],
    ['dumbbell', 'bench'],
    'beginner',
    0.4, // Per arm
    ['barbell-row', 'cable-row', 'machine-row'],
    true // unilateral
  ),

  createExercise(
    'Dumbbell Shoulder Press',
    'An overhead pressing movement using dumbbells for shoulder development.',
    ['shoulders'],
    ['triceps', 'traps'],
    ['dumbbell'],
    'beginner',
    0.3, // Per arm
    ['barbell-overhead-press', 'machine-shoulder-press'],
    false
  ),

  createExercise(
    'Goblet Squat',
    'A beginner-friendly squat variation holding a single dumbbell or kettlebell.',
    ['quads', 'glutes'],
    ['hamstrings', 'core'],
    ['dumbbell', 'kettlebell'],
    'beginner',
    0.5,
    ['barbell-back-squat', 'front-squat', 'bodyweight-squat']
  ),

  // BODYWEIGHT EXERCISES
  createExercise(
    'Push-up',
    'A fundamental bodyweight exercise for the upper body.',
    ['chest'],
    ['shoulders', 'triceps', 'core'],
    ['bodyweight'],
    'beginner',
    0.0, // Body percentage
    ['bench-press', 'incline-push-up', 'decline-push-up']
  ),

  createExercise(
    'Pull-up',
    'A vertical pulling movement using bodyweight.',
    ['back', 'lats'],
    ['biceps', 'forearms', 'shoulders'],
    ['bodyweight', 'pull_up_bar'],
    'intermediate',
    0.0,
    ['chin-up', 'lat-pulldown', 'assisted-pull-up']
  ),

  createExercise(
    'Bodyweight Squat',
    'A lower body exercise using only bodyweight for resistance.',
    ['quads', 'glutes'],
    ['hamstrings'],
    ['bodyweight'],
    'beginner',
    0.0,
    ['goblet-squat', 'back-squat', 'split-squat']
  ),

  createExercise(
    'Lunge',
    'A unilateral lower body exercise that develops balance and strength.',
    ['quads', 'glutes'],
    ['hamstrings', 'core'],
    ['bodyweight'],
    'beginner',
    0.0,
    ['split-squat', 'walking-lunge', 'bulgarian-split-squat'],
    true // unilateral
  ),

  // MACHINE EXERCISES
  createExercise(
    'Lat Pulldown',
    'A machine exercise that mimics the pull-up motion.',
    ['back', 'lats'],
    ['biceps', 'forearms'],
    ['machine', 'cable'],
    'beginner',
    0.7,
    ['pull-up', 'seated-row', 'straight-arm-pulldown']
  ),

  createExercise(
    'Leg Press',
    'A machine-based lower body pushing exercise.',
    ['quads', 'glutes'],
    ['hamstrings'],
    ['machine'],
    'beginner',
    2.0,
    ['hack-squat', 'barbell-squat', 'dumbbell-squat']
  ),

  createExercise(
    'Chest Press Machine',
    'A machine-based pushing exercise for the chest.',
    ['chest'],
    ['triceps', 'shoulders'],
    ['machine'],
    'beginner',
    0.9,
    ['bench-press', 'dumbbell-bench-press', 'push-up']
  ),

  // ISOLATION EXERCISES
  createExercise(
    'Bicep Curl',
    'An isolation exercise for the biceps.',
    ['biceps'],
    ['forearms'],
    ['dumbbell', 'barbell', 'cable'],
    'beginner',
    0.3,
    ['hammer-curl', 'preacher-curl', 'chin-up']
  ),

  createExercise(
    'Tricep Pushdown',
    'An isolation exercise for the triceps using a cable machine.',
    ['triceps'],
    [],
    ['cable'],
    'beginner',
    0.3,
    ['skull-crusher', 'tricep-dip', 'overhead-tricep-extension']
  ),

  createExercise(
    'Leg Extension',
    'An isolation exercise for the quadriceps.',
    ['quads'],
    [],
    ['machine'],
    'beginner',
    0.5,
    ['leg-press', 'squat', 'lunge']
  ),

  createExercise(
    'Leg Curl',
    'An isolation exercise for the hamstrings.',
    ['hamstrings'],
    [],
    ['machine'],
    'beginner',
    0.5,
    ['romanian-deadlift', 'glute-ham-raise', 'good-morning']
  ),

  createExercise(
    'Lateral Raise',
    'An isolation exercise for the lateral deltoids.',
    ['shoulders'],
    [],
    ['dumbbell', 'cable'],
    'beginner',
    0.1,
    ['front-raise', 'upright-row', 'overhead-press']
  ),

  createExercise(
    'Calf Raise',
    'An isolation exercise for the calves.',
    ['calves'],
    [],
    ['machine', 'dumbbell', 'bodyweight'],
    'beginner',
    0.8,
    ['seated-calf-raise', 'donkey-calf-raise']
  ),

  // Add more exercises as needed
];

// Fix exercise alternatives after all are created
export const processExerciseAlternatives = (): Exercise[] => {
  const exerciseMap = new Map<string, Exercise>();

  // Create a map for easy lookup
  exercises.forEach(exercise => {
    exerciseMap.set(exercise.id, exercise);
  });

  // Update alternative exercises with valid IDs
  return exercises.map(exercise => {
    const validAlternatives = exercise.alternativeExercises
      .filter(altId => exerciseMap.has(altId))
      .map(altId => altId);

    return {
      ...exercise,
      alternativeExercises: validAlternatives,
    };
  });
};

// Export processed exercises
export const processedExercises = processExerciseAlternatives();
