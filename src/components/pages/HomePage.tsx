import React from 'react';
import Button from '../Button';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-800 mb-6">
        Strength Training App
      </h1>
      <p className="text-lg text-gray-700 mb-10">
        Welcome to your personal strength training companion!
      </p>
      <div className="flex space-x-4">
        <Button onClick={() => alert("Workout Generator Page")}>
          Workout Generator
        </Button>
        <Button onClick={() => alert("Progress Tracking Page")}>
          Progress Tracking
        </Button>
        <Button onClick={() => alert("Settings Page")}>
          Settings
        </Button>
      </div>
    </div>
  );
};

export default HomePage;