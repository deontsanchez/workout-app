'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Slider,
  Divider,
  Alert,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  Calculate as CalculateIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import {
  ExperienceLevel,
  FitnessGoal,
  Gender,
  MeasurementSystem,
} from '@/types';
import {
  calculateBaselineWeight,
  adjustWeightForGoal,
} from '@/utils/weightCalculator';

interface WeightCalculatorProps {
  initialBodyweight?: number;
  initialGender?: Gender;
  initialAge?: number;
  initialExperience?: ExperienceLevel;
  initialSystem?: MeasurementSystem;
  initialGoal?: FitnessGoal;
}

const WeightCalculator = ({
  initialBodyweight = 70, // Default 70kg or 154lbs
  initialGender = 'male',
  initialAge = 30,
  initialExperience = 'intermediate',
  initialSystem = 'metric',
  initialGoal = 'muscle_gain',
}: WeightCalculatorProps) => {
  const theme = useTheme();

  // User parameters
  const [bodyweight, setBodyweight] = useState(initialBodyweight);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [age, setAge] = useState(initialAge);
  const [experience, setExperience] =
    useState<ExperienceLevel>(initialExperience);
  const [measurementSystem, setMeasurementSystem] =
    useState<MeasurementSystem>(initialSystem);
  const [goal, setGoal] = useState<FitnessGoal>(initialGoal);

  // Exercise parameters
  const [exerciseRatio, setExerciseRatio] = useState(1.0);
  const [exerciseName, setExerciseName] = useState('Bench Press');

  // Results
  const [baselineWeight, setBaselineWeight] = useState(0);
  const [adjustedWeight, setAdjustedWeight] = useState(0);
  const [rpeData, setRpeData] = useState<Record<string, number>>({});

  // Calculate weights when parameters change
  useEffect(() => {
    const baseline = calculateBaselineWeight(
      exerciseRatio,
      bodyweight,
      gender,
      age,
      experience,
      measurementSystem
    );

    setBaselineWeight(baseline);
    const adjusted = adjustWeightForGoal(baseline, goal);
    setAdjustedWeight(adjusted);

    // Calculate RPE variations (simple approach)
    const rpeVariations: Record<string, number> = {};
    for (let rpe = 6; rpe <= 10; rpe++) {
      // Simplified: Higher RPE means higher weight
      const factor = 0.9 + rpe * 0.02; // RPE 6 = 0.92, RPE 10 = 1.0
      rpeVariations[`RPE ${rpe}`] = Math.round(adjusted * factor);
    }
    setRpeData(rpeVariations);
  }, [
    exerciseRatio,
    bodyweight,
    gender,
    age,
    experience,
    measurementSystem,
    goal,
  ]);

  // Common exercises with their ratios
  const commonExercises = [
    { name: 'Bench Press', ratio: 1.0 },
    { name: 'Squat', ratio: 1.5 },
    { name: 'Deadlift', ratio: 1.75 },
    { name: 'Overhead Press', ratio: 0.65 },
    { name: 'Barbell Row', ratio: 0.7 },
    { name: 'Pull-up', ratio: 0.3 },
  ];

  // Helper for weight unit display
  const weightUnit = measurementSystem === 'metric' ? 'kg' : 'lbs';

  // Format weight to include units
  const formatWeight = (weight: number) => {
    // Round to nearest 2.5 for metric, 5 for imperial
    const roundedWeight =
      measurementSystem === 'metric'
        ? Math.round(weight / 2.5) * 2.5
        : Math.round(weight / 5) * 5;

    return `${roundedWeight} ${weightUnit}`;
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        <FitnessCenterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Personalized Weight Calculator
      </Typography>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 5,
        }}
      >
        <Grid container spacing={3}>
          {/* User Parameters Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              User Parameters
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Measurement System</InputLabel>
              <Select
                value={measurementSystem}
                label="Measurement System"
                onChange={e =>
                  setMeasurementSystem(e.target.value as MeasurementSystem)
                }
              >
                <MenuItem value="metric">Metric (kg)</MenuItem>
                <MenuItem value="imperial">Imperial (lbs)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={`Bodyweight (${weightUnit})`}
              type="number"
              value={bodyweight}
              onChange={e => setBodyweight(parseFloat(e.target.value) || 0)}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                label="Gender"
                onChange={e => setGender(e.target.value as Gender)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Age"
              type="number"
              value={age}
              onChange={e => setAge(parseInt(e.target.value) || 0)}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={experience}
                label="Experience Level"
                onChange={e => setExperience(e.target.value as ExperienceLevel)}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Fitness Goal</InputLabel>
              <Select
                value={goal}
                label="Fitness Goal"
                onChange={e => setGoal(e.target.value as FitnessGoal)}
              >
                <MenuItem value="weight_loss">Weight Loss</MenuItem>
                <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                <MenuItem value="strength">Strength</MenuItem>
                <MenuItem value="endurance">Endurance</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Exercise Selection Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Exercise Parameters
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Common Exercises</InputLabel>
              <Select
                value={exerciseName}
                label="Common Exercises"
                onChange={e => {
                  const selected = e.target.value;
                  setExerciseName(selected);
                  const exercise = commonExercises.find(
                    ex => ex.name === selected
                  );
                  if (exercise) {
                    setExerciseRatio(exercise.ratio);
                  }
                }}
              >
                {commonExercises.map(ex => (
                  <MenuItem key={ex.name} value={ex.name}>
                    {ex.name} ({ex.ratio}x bodyweight)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <Typography id="exercise-ratio-slider" gutterBottom>
                Strength Ratio (relative to bodyweight):{' '}
                {exerciseRatio.toFixed(2)}x
              </Typography>
              <Slider
                value={exerciseRatio}
                min={0.1}
                max={2.5}
                step={0.05}
                onChange={(_, value) => setExerciseRatio(value as number)}
                aria-labelledby="exercise-ratio-slider"
                marks={[
                  { value: 0.5, label: '0.5x' },
                  { value: 1.0, label: '1.0x' },
                  { value: 1.5, label: '1.5x' },
                  { value: 2.0, label: '2.0x' },
                ]}
              />
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                The strength ratio represents how much weight you can lift
                relative to your bodyweight. For example, a 1.5x ratio for
                squats means an intermediate lifter should squat about 1.5 times
                their bodyweight.
              </Typography>
            </Alert>

            <Divider sx={{ my: 3 }} />

            {/* Results Section */}
            <Typography
              variant="h6"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CalculateIcon sx={{ mr: 1 }} />
              Recommended Weights
            </Typography>

            <Card
              variant="outlined"
              sx={{ mt: 2, backgroundColor: theme.palette.background.default }}
            >
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Baseline: <strong>{formatWeight(baselineWeight)}</strong>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Adjusted for {goal.replace('_', ' ')}:{' '}
                  <strong>{formatWeight(adjustedWeight)}</strong>
                </Typography>
              </CardContent>
            </Card>

            <Typography
              variant="h6"
              sx={{ mt: 3, display: 'flex', alignItems: 'center' }}
            >
              <BarChartIcon sx={{ mr: 1 }} />
              RPE Variations
            </Typography>

            <Card
              variant="outlined"
              sx={{ mt: 2, backgroundColor: theme.palette.background.default }}
            >
              <CardContent>
                {Object.entries(rpeData).map(([rpe, weight]) => (
                  <Typography key={rpe} variant="body1" gutterBottom>
                    {rpe}: <strong>{formatWeight(weight)}</strong>
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default WeightCalculator;
