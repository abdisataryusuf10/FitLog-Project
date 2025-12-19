import React from 'react';
import WorkoutTemplates from '../components/workouts/WorkoutTemplates';

const TemplatesPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workout Templates</h1>
        <p className="text-gray-600 dark:text-gray-400">Save and reuse your favorite workout routines</p>
      </div>
      <WorkoutTemplates />
    </div>
  );
};

export default TemplatesPage;