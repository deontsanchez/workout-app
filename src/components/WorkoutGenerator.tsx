'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { generateWorkout } from '@/utils/workoutGenerator';
import {
  FitnessGoal,
  ExperienceLevel,
  MuscleGroup,
  WorkoutExercise,
} from '@/types';
import { getPeriodizationWeek } from '@/utils/periodization';
import {
  calculateBaselineWeight,
  adjustWeightForGoal,
  calculateSetWeight,
} from '@/utils/weightCalculator';
import { processedExercises } from '@/database/exercises';

interface WorkoutGeneratorProps {
  userWeight?: number;
  userGender?: 'male' | 'female' | 'other';
  userAge?: number;
  userExperience?: ExperienceLevel;
  userGoal?: FitnessGoal;
  userEquipment?: string[];
  measurementSystem?: 'metric' | 'imperial';
  onSaveWorkout?: (workout: {
    exercises: WorkoutExercise[];
    workoutType: string;
    warmup: { name: string; duration: number; instructions: string[] };
    cooldown: { name: string; duration: number; instructions: string[] };
    estimatedDuration: number;
  }) => void;
}

const WorkoutGenerator = ({
  userWeight = 70,
  userGender = 'male',
  userAge = 30,
  userExperience = 'intermediate',
  userGoal = 'muscle_gain',
  userEquipment = [
    'barbell',
    'dumbbell',
    'bench',
    'cable',
    'machine',
    'bodyweight',
  ],
  measurementSystem = 'metric',
  onSaveWorkout,
}: WorkoutGeneratorProps) => {
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // Parameters for workout generation
  const [goal, setGoal] = useState<FitnessGoal>(userGoal);
  const [experience, setExperience] = useState<ExperienceLevel>(userExperience);
  const [availableEquipment, setAvailableEquipment] =
    useState<string[]>(userEquipment);
  const [timeAvailable, setTimeAvailable] = useState<number>(60);
  const [weekInCycle, setWeekInCycle] = useState<number>(1);
  const [preferredMuscleGroups, setPreferredMuscleGroups] = useState<
    MuscleGroup[]
  >([]);

  // Generated workout data
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<{
    exercises: WorkoutExercise[];
    workoutType: string;
    warmup: { name: string; duration: number; instructions: string[] };
    cooldown: { name: string; duration: number; instructions: string[] };
    estimatedDuration: number;
  } | null>(null);

  // Equipment options
  const equipmentOptions = [
    { value: 'barbell', label: 'Barbell' },
    { value: 'dumbbell', label: 'Dumbbells' },
    { value: 'kettlebell', label: 'Kettlebells' },
    { value: 'machine', label: 'Weight Machines' },
    { value: 'cable', label: 'Cable Machines' },
    { value: 'bodyweight', label: 'Bodyweight' },
    { value: 'resistance_band', label: 'Resistance Bands' },
    { value: 'medicine_ball', label: 'Medicine Ball' },
    { value: 'bench', label: 'Bench' },
    { value: 'pull_up_bar', label: 'Pull-up Bar' },
    { value: 'trx', label: 'TRX/Suspension Trainer' },
  ];

  // Muscle group options
  const muscleGroupOptions: { value: MuscleGroup; label: string }[] = [
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'biceps', label: 'Biceps' },
    { value: 'triceps', label: 'Triceps' },
    { value: 'forearms', label: 'Forearms' },
    { value: 'abs', label: 'Abs' },
    { value: 'quads', label: 'Quadriceps' },
    { value: 'hamstrings', label: 'Hamstrings' },
    { value: 'glutes', label: 'Glutes' },
    { value: 'calves', label: 'Calves' },
    { value: 'core', label: 'Core' },
  ];

  // Workout type label
  const getWorkoutTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      strength: 'Strength',
      hypertrophy: 'Muscle Building',
      endurance: 'Muscular Endurance',
      deload: 'Recovery/Deload',
    };
    return labels[type] || type;
  };

  // Toggle equipment selection
  const toggleEquipment = (equipment: string) => {
    if (availableEquipment.includes(equipment)) {
      setAvailableEquipment(availableEquipment.filter(eq => eq !== equipment));
    } else {
      setAvailableEquipment([...availableEquipment, equipment]);
    }
  };

  // Toggle muscle group selection
  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    if (preferredMuscleGroups.includes(muscleGroup)) {
      setPreferredMuscleGroups(
        preferredMuscleGroups.filter(mg => mg !== muscleGroup)
      );
    } else {
      setPreferredMuscleGroups([...preferredMuscleGroups, muscleGroup]);
    }
  };

  // Steps for the workout generation process
  const steps = [
    'Workout Parameters',
    'Equipment Selection',
    'Muscle Focus',
    'Generated Workout',
  ];

  // Handle next step
  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      generateWorkoutPlan();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Reset the generator
  const handleReset = () => {
    setActiveStep(0);
    setGeneratedWorkout(null);
  };

  // Generate the workout plan
  const generateWorkoutPlan = async () => {
    setIsGenerating(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const workout = generateWorkout(
        {
          goal,
          experience,
          availableEquipment,
          timeAvailable,
          weekInCycle,
          muscleGroupPreferences:
            preferredMuscleGroups.length > 0
              ? preferredMuscleGroups
              : undefined,
        },
        processedExercises
      );

      // Calculate appropriate weights for exercises based on user profile
      const exercisesWithWeights = workout.exercises.map(exercise => {
        const exerciseData = processedExercises.find(
          e => e.id === exercise.exerciseId
        );

        if (!exerciseData) return exercise;

        const baselineWeight = calculateBaselineWeight(
          exerciseData.baselineStrengthRatio,
          userWeight,
          userGender,
          userAge,
          experience,
          measurementSystem
        );

        const adjustedBaseWeight = adjustWeightForGoal(baselineWeight, goal);

        // Update weights for each set
        const updatedSets = exercise.sets.map(set => {
          const calculatedWeight = calculateSetWeight(
            adjustedBaseWeight,
            set.reps,
            set.rpe || 7,
            set.isWarmup
          );

          return {
            ...set,
            weight: calculatedWeight,
          };
        });

        return {
          ...exercise,
          sets: updatedSets,
        };
      });

      setGeneratedWorkout({
        ...workout,
        exercises: exercisesWithWeights,
      });

      setActiveStep(activeStep + 1);
    } catch (error) {
      console.error('Error generating workout:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  // Get exercise name by ID
  const getExerciseName = (exerciseId: string): string => {
    const exercise = processedExercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Unknown Exercise';
  };

  // Format weight for display
  const formatWeight = (weight: number): string => {
    const roundedWeight =
      measurementSystem === 'metric'
        ? Math.round(weight / 2.5) * 2.5 // Round to nearest 2.5kg
        : Math.round(weight / 5) * 5; // Round to nearest 5lbs

    const unit = measurementSystem === 'metric' ? 'kg' : 'lbs';
    return `${roundedWeight} ${unit}`;
  };

  // Get periodization week info
  useEffect(() => {
    const periodizationWeek = getPeriodizationWeek(goal, weekInCycle);
    console.log('Periodization week:', periodizationWeek);
  }, [goal, weekInCycle]);

  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Workout Parameters
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Fitness Goal</InputLabel>
                  <Select
                    value={goal}
                    label="Fitness Goal"
                    onChange={e => setGoal(e.target.value as FitnessGoal)}
                  >
                    <MenuItem value="muscle_gain">Build Muscle</MenuItem>
                    <MenuItem value="strength">Gain Strength</MenuItem>
                    <MenuItem value="weight_loss">Lose Weight</MenuItem>
                    <MenuItem value="endurance">Improve Endurance</MenuItem>
                    <MenuItem value="maintenance">Maintain Fitness</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={experience}
                    label="Experience Level"
                    onChange={e =>
                      setExperience(e.target.value as ExperienceLevel)
                    }
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Available Time (minutes)"
                  type="number"
                  value={timeAvailable}
                  onChange={e =>
                    setTimeAvailable(
                      Math.max(
                        30,
                        Math.min(180, parseInt(e.target.value) || 60)
                      )
                    )
                  }
                  InputProps={{ inputProps: { min: 30, max: 180 } }}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Week in Workout Cycle</InputLabel>
                  <Select
                    value={weekInCycle}
                    label="Week in Workout Cycle"
                    onChange={e => setWeekInCycle(Number(e.target.value))}
                  >
                    <MenuItem value={1}>Week 1</MenuItem>
                    <MenuItem value={2}>Week 2</MenuItem>
                    <MenuItem value={3}>Week 3</MenuItem>
                    <MenuItem value={4}>Week 4 (Deload)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Workout Type:{' '}
                {getWorkoutTypeLabel(
                  getPeriodizationWeek(goal, weekInCycle).type
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Based on your goals and the selected week in your training
                cycle, we&apos;ll generate a{' '}
                {getWorkoutTypeLabel(
                  getPeriodizationWeek(goal, weekInCycle).type
                ).toLowerCase()}{' '}
                focused workout.
              </Typography>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Equipment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the equipment you have access to for this workout
            </Typography>

            <Grid container spacing={1}>
              {equipmentOptions.map(equipment => (
                <Grid item key={equipment.value}>
                  <Chip
                    label={equipment.label}
                    onClick={() => toggleEquipment(equipment.value)}
                    color={
                      availableEquipment.includes(equipment.value)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      availableEquipment.includes(equipment.value)
                        ? 'filled'
                        : 'outlined'
                    }
                    sx={{ m: 0.5 }}
                  />
                </Grid>
              ))}
            </Grid>

            {availableEquipment.length === 0 && (
              <Typography color="error" sx={{ mt: 2 }}>
                Please select at least one type of equipment
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Muscle Group Focus
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select muscle groups to focus on (optional)
            </Typography>

            <Grid container spacing={1}>
              {muscleGroupOptions.map(muscleGroup => (
                <Grid item key={muscleGroup.value}>
                  <Chip
                    label={muscleGroup.label}
                    onClick={() => toggleMuscleGroup(muscleGroup.value)}
                    color={
                      preferredMuscleGroups.includes(muscleGroup.value)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      preferredMuscleGroups.includes(muscleGroup.value)
                        ? 'filled'
                        : 'outlined'
                    }
                    sx={{ m: 0.5 }}
                  />
                </Grid>
              ))}
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {preferredMuscleGroups.length === 0
                ? 'No specific focus selected. We will generate a balanced full-body workout.'
                : 'Your workout will focus on the selected muscle groups.'}
            </Typography>
          </Box>
        );
      case 3:
        return (
          <Box>
            {generatedWorkout ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" component="h2">
                    {getWorkoutTypeLabel(generatedWorkout.workoutType)} Workout
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary', mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {generatedWorkout.estimatedDuration} min
                    </Typography>
                  </Box>
                </Box>

                {/* Warmup Section */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
                    {generatedWorkout.warmup.name} (
                    {generatedWorkout.warmup.duration} min)
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    {generatedWorkout.warmup.instructions.map(
                      (instruction, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Typography variant="body2" color="primary">
                              {index + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText primary={instruction} />
                        </ListItem>
                      )
                    )}
                  </List>
                </Paper>

                {/* Exercises */}
                <Typography variant="h6" gutterBottom>
                  <FormatListBulletedIcon
                    fontSize="small"
                    sx={{ mr: 1, verticalAlign: 'middle' }}
                  />
                  Exercises
                </Typography>

                {generatedWorkout.exercises.map((exercise, index) => {
                  const exerciseName = getExerciseName(exercise.exerciseId);
                  return (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {index + 1}. {exerciseName}
                        </Typography>

                        <Grid container spacing={1} sx={{ mb: 1 }}>
                          {exercise.sets.map((set, setIndex) => (
                            <Grid item xs={12} key={setIndex}>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 1,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  bgcolor: set.isWarmup
                                    ? 'action.hover'
                                    : 'background.paper',
                                }}
                              >
                                <Typography variant="body2">
                                  {set.isWarmup
                                    ? 'Warmup'
                                    : `Set ${
                                        setIndex -
                                        exercise.sets.filter(s => s.isWarmup)
                                          .length +
                                        1
                                      }`}
                                </Typography>
                                <Typography variant="body2">
                                  {set.reps} reps × {formatWeight(set.weight)}
                                </Typography>
                                <Typography variant="body2">
                                  RPE: {set.rpe}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>

                        <Box
                          sx={{
                            mt: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Rest: {exercise.restBetweenSets} sec
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Cooldown Section */}
                <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <TrendingUpIcon
                      fontSize="small"
                      sx={{ mr: 1, transform: 'rotate(180deg)' }}
                    />
                    {generatedWorkout.cooldown.name} (
                    {generatedWorkout.cooldown.duration} min)
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <List dense>
                    {generatedWorkout.cooldown.instructions.map(
                      (instruction, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Typography variant="body2" color="primary">
                              {index + 1}.
                            </Typography>
                          </ListItemIcon>
                          <ListItemText primary={instruction} />
                        </ListItem>
                      )
                    )}
                  </List>
                </Paper>

                {/* Save Workout Button */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() =>
                      onSaveWorkout && onSaveWorkout(generatedWorkout)
                    }
                  >
                    Save Workout
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Generating your personalized workout...
                </Typography>
              </Box>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <FitnessCenterIcon sx={{ mr: 1 }} />
        Workout Generator
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0 || isGenerating}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />

          {activeStep === steps.length - 1 ? (
            <Button onClick={handleReset} color="primary">
              Create New Workout
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={
                isGenerating ||
                (activeStep === 1 && availableEquipment.length === 0)
              }
            >
              {activeStep === steps.length - 2 ? 'Generate' : 'Next'}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default WorkoutGenerator;
