'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon,
  Favorite as FavoriteIcon,
  CompareArrows as CompareArrowsIcon,
} from '@mui/icons-material';
import { processedExercises } from '@/database/exercises';
import {
  Exercise,
  MuscleGroup,
  EquipmentType,
  ExerciseDifficulty,
} from '@/types';

interface ExerciseDatabaseProps {
  onSelectExercise?: (exercise: Exercise) => void;
  showSelectButton?: boolean;
}

const ExerciseDatabase = ({
  onSelectExercise,
  showSelectButton = false,
}: ExerciseDatabaseProps) => {
  const theme = useTheme();

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<
    MuscleGroup | 'all'
  >('all');
  const [selectedEquipment, setSelectedEquipment] = useState<
    EquipmentType | 'all'
  >('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ExerciseDifficulty | 'all'
  >('all');
  const [showFilters, setShowFilters] = useState(false);

  // Unique muscle groups, equipment types, and difficulty levels from the data
  const muscleGroups = useMemo(() => {
    const groups = new Set<MuscleGroup>();
    processedExercises.forEach(exercise => {
      exercise.primaryMuscleGroups.forEach(group => groups.add(group));
      exercise.secondaryMuscleGroups.forEach(group => groups.add(group));
    });
    return Array.from(groups).sort();
  }, []);

  const equipmentTypes = useMemo(() => {
    const types = new Set<EquipmentType>();
    processedExercises.forEach(exercise => {
      exercise.equipment.forEach(type => types.add(type));
    });
    return Array.from(types).sort();
  }, []);

  const difficultyLevels: ExerciseDifficulty[] = [
    'beginner',
    'intermediate',
    'advanced',
  ];

  // Filter exercises based on selected filters
  const filteredExercises = useMemo(() => {
    return processedExercises.filter(exercise => {
      // Search term filter
      if (
        searchTerm &&
        !exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Muscle group filter
      if (
        selectedMuscleGroup !== 'all' &&
        !exercise.primaryMuscleGroups.includes(selectedMuscleGroup) &&
        !exercise.secondaryMuscleGroups.includes(selectedMuscleGroup)
      ) {
        return false;
      }

      // Equipment filter
      if (
        selectedEquipment !== 'all' &&
        !exercise.equipment.includes(selectedEquipment)
      ) {
        return false;
      }

      // Difficulty filter
      if (
        selectedDifficulty !== 'all' &&
        exercise.difficulty !== selectedDifficulty
      ) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedMuscleGroup, selectedEquipment, selectedDifficulty]);

  // Capitalize first letter of each word
  const capitalize = (str: string) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get alternative exercises for an exercise
  const getAlternativeExercises = (exercise: Exercise) => {
    return exercise.alternativeExercises
      .map(id => processedExercises.find(ex => ex.id === id))
      .filter(ex => ex !== undefined) as Exercise[];
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
        Exercise Database
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Grid>
        </Grid>

        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Muscle Group</InputLabel>
                  <Select
                    value={selectedMuscleGroup}
                    label="Muscle Group"
                    onChange={e =>
                      setSelectedMuscleGroup(
                        e.target.value as MuscleGroup | 'all'
                      )
                    }
                  >
                    <MenuItem value="all">All Muscle Groups</MenuItem>
                    {muscleGroups.map(group => (
                      <MenuItem key={group} value={group}>
                        {capitalize(group)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Equipment</InputLabel>
                  <Select
                    value={selectedEquipment}
                    label="Equipment"
                    onChange={e =>
                      setSelectedEquipment(
                        e.target.value as EquipmentType | 'all'
                      )
                    }
                  >
                    <MenuItem value="all">All Equipment</MenuItem>
                    {equipmentTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {capitalize(type)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={selectedDifficulty}
                    label="Difficulty"
                    onChange={e =>
                      setSelectedDifficulty(
                        e.target.value as ExerciseDifficulty | 'all'
                      )
                    }
                  >
                    <MenuItem value="all">All Difficulties</MenuItem>
                    {difficultyLevels.map(level => (
                      <MenuItem key={level} value={level}>
                        {capitalize(level)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Exercise Cards */}
      <Typography variant="subtitle1" gutterBottom>
        {filteredExercises.length} exercises found
      </Typography>

      <Grid container spacing={3}>
        {filteredExercises.map(exercise => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {exercise.name}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={capitalize(exercise.difficulty)}
                    size="small"
                    color={
                      exercise.difficulty === 'beginner'
                        ? 'success'
                        : exercise.difficulty === 'intermediate'
                        ? 'info'
                        : 'warning'
                    }
                    sx={{ mr: 1, mb: 1 }}
                  />

                  {exercise.equipment.map(eq => (
                    <Chip
                      key={eq}
                      label={capitalize(eq)}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {exercise.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Primary Muscles:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                    {exercise.primaryMuscleGroups.map(muscle => (
                      <Chip
                        key={muscle}
                        label={capitalize(muscle)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>

                {exercise.secondaryMuscleGroups.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">
                      Secondary Muscles:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                      {exercise.secondaryMuscleGroups.map(muscle => (
                        <Chip
                          key={muscle}
                          label={capitalize(muscle)}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Baseline Strength: {exercise.baselineStrengthRatio}x
                    bodyweight
                  </Typography>
                </Box>
              </CardContent>

              <Divider />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Instructions & Tips</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" gutterBottom>
                    Instructions:
                  </Typography>
                  <Box component="ol" sx={{ pl: 2, mt: 0, mb: 2 }}>
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>
                        <Typography variant="body2">{instruction}</Typography>
                      </li>
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Tips:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                    {exercise.tips.map((tip, index) => (
                      <li key={index}>
                        <Typography variant="body2">{tip}</Typography>
                      </li>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {getAlternativeExercises(exercise).length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Alternative Exercises</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                      {getAlternativeExercises(exercise).map(alt => (
                        <li key={alt.id}>
                          <Typography variant="body2">{alt.name}</Typography>
                        </li>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}

              <CardActions>
                <Tooltip title="View Exercise Details">
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Add to Favorites">
                  <IconButton size="small">
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Compare with Another Exercise">
                  <IconButton size="small">
                    <CompareArrowsIcon />
                  </IconButton>
                </Tooltip>

                {showSelectButton && onSelectExercise && (
                  <Button
                    size="small"
                    onClick={() => onSelectExercise(exercise)}
                    sx={{ ml: 'auto' }}
                  >
                    Select
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredExercises.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            backgroundColor: theme.palette.background.default,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">No exercises found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search term
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ExerciseDatabase;
