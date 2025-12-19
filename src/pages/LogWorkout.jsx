import React from 'react';
import WorkoutLog from '../components/WorkoutLog';

const LogWorkoutPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Log New Workout</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your exercises, sets, reps, and weights</p>
      </div>
      <WorkoutLog />
    </div>
  );
};

export default LogWorkoutPage;