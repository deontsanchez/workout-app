import React, { useState, ChangeEvent } from 'react';
import Input from '../Input';
import Dropdown from '../Dropdown';
import Button from '../Button';
import { generateWorkout } from '@/utils/workoutGenerator';
import Card from '../Card';

const WorkoutGeneratorPage: React.FC = () => {
  const [timeAvailable, setTimeAvailable] = useState<number | null>(null);
  const [equipment, setEquipment] = useState<string>('Barbell');
  const [goal, setGoal] = useState<string>('Lose weight');
  const [userExperience, setUserExperience] = useState<string>('Beginner');
  const [timeAvailableError, setTimeAvailableError] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  interface Exercise {
    name: string;
    sets: number;
    reps: number;
    rest: number;
  }
  interface Option {
    value: string;
    label: string;
  }
  const [workout, setWorkout] = useState<string | null>(null);
  
  const equipmentOptions = [
    { value: 'Barbell', label: 'Barbell' },
    { value: 'Dumbbells', label: 'Dumbbells' },
    { value: 'Bodyweight', label: 'Bodyweight' },
    { value: 'Machine', label: 'Machine' },
  ];
    const goalOptions: Option[] = [
    { value: 'Lose weight', label: 'Lose weight' },
    { value: 'Build muscle', label: 'Build muscle' },
    { value: 'Gain strength', label: 'Gain strength' },
  ];

  const experienceOptions: Option[] = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  const handleGenerateWorkout = async () => {
      setTimeAvailableError(null);

    setErrorMessage(null);
    setWorkout(null);
    
    if (timeAvailable === null || equipment === '' || goal === '' || userExperience === '') {
      setErrorMessage("Please fill all the fields.");
      return;
    }

    if (timeAvailable <= 0) {
      setTimeAvailableError("Time available must be a positive number.");
      return;
    }
    try {
        const result = generateWorkout({
        timeAvailable: timeAvailable,
        availableEquipment: equipment,
        goal: goal,
        experienceLevel: userExperience,
      });

      if (typeof result === 'string') {
        setErrorMessage(result);
      } else {
        let formattedWorkout: string = '';
        result.forEach((exercise: Exercise, index: number) => {
          if (
            !exercise.name ||
            !exercise.sets ||
            !exercise.reps ||
            !exercise.rest
          ) {
            throw new Error('Invalid exercise format');
          }
          formattedWorkout += `<p><b>Exercise ${index + 1}:</b></p>`;
          formattedWorkout += `<p>  <b>Name:</b> ${exercise.name}</p>`;
          formattedWorkout += `<p>  <b>Sets:</b> ${exercise.sets}</p>`;
          formattedWorkout += `<p>  <b>Reps:</b> ${exercise.reps}</p>`;
          formattedWorkout += `<p>  <b>Rest:</b> ${exercise.rest} seconds</p><br/>`;
        });
        setWorkout(formattedWorkout);
      }
    } catch (error) {
      setErrorMessage('An error occurred while generating the workout.');
    }
  };

  const handleClear = () => {
    setTimeAvailable(null);
    setEquipment('Barbell');
    setGoal('');
    setUserExperience('');
    setWorkout(null);
    setErrorMessage(null);
    setTimeAvailableError(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Workout Generator</h1>
      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage}</div>
      )}
      <div className="space-y-4">
        <Input
          label="Time Available (minutes)"
          type="number"
          value={timeAvailable === null ? '' : timeAvailable.toString()}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setTimeAvailable(value === '' ? null : parseInt(value, 10));
          }}
          error={timeAvailableError}
          placeholder="Enter time in minutes"
        />
        {timeAvailableError && (
          <div className="text-red-500">{timeAvailableError}</div>
        )}
        <Dropdown
          label="Equipment"
          value={equipment}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setEquipment(e.target.value)
          }
          options={equipmentOptions}
        />
        <Dropdown
          label="Goal"
          value={goal}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setGoal(e.target.value)
          }
          options={goalOptions}
        />
        <Dropdown
          label="Experience"
          value={userExperience}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setUserExperience(e.target.value)
          }
          options={experienceOptions}
        />
        <div className="flex gap-2">
          <Button onClick={handleGenerateWorkout}>Generate Workout</Button>
          <Button onClick={handleClear} >Clear</Button>
        </div>
        {workout && (
          <div className="mt-4">
            <Card>
              <div dangerouslySetInnerHTML={{ __html: workout }} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutGeneratorPage;