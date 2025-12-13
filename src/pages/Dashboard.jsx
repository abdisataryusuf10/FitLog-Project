import React from 'react';
import ProgressChart from '../components/ProgressChart';
import { useWorkouts } from '../context/WorkoutContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard = () => {
  const { workouts, getWorkoutStats } = useWorkouts();
  const stats = getWorkoutStats();

  const recentWorkouts = workouts.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FitLog</h1>
        <p className="text-gray-600">Track your fitness journey and monitor your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
              <Link to="/log-workout" className="btn-primary">
                + Log Workout
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-700">{stats.totalWorkouts}</div>
                <div className="text-sm text-gray-600">Workouts</div>
              </div>
              
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary-700">{stats.totalExercises}</div>
                <div className="text-sm text-gray-600">Exercises</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{stats.averageSets}</div>
                <div className="text-sm text-gray-600">Avg Sets</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {parseInt(stats.totalWeightLifted).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total kg</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Workouts</h2>
          {recentWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">💪</div>
              <p className="text-gray-600 mb-4">No workouts yet</p>
              <Link to="/log-workout" className="btn-primary inline-block">
                Log First Workout
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <Link
                  key={workout.id}
                  to="/history"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{workout.name}</h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(workout.timestamp), 'MMM d')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <ProgressChart />
      </div>
    </div>
  );
};

export default Dashboard;