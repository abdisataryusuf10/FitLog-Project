import React from 'react';
import WorkoutHistory from '../components/WorkoutHistory';

const HistoryPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout History</h1>
        <p className="text-gray-600">View and manage your past workouts</p>
      </div>
      <WorkoutHistory />
    </div>
  );
};

export default HistoryPage;