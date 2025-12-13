import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { format } from 'date-fns';

const WorkoutHistory = () => {
  const { workouts, deleteWorkout } = useWorkouts();
  const [filter, setFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(filter.toLowerCase()) ||
      workout.exercises.some(ex => ex.name.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesDate = !selectedDate || 
      format(new Date(workout.timestamp), 'yyyy-MM-dd') === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  const groupedWorkouts = filteredWorkouts.reduce((groups, workout) => {
    const date = format(new Date(workout.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(workout);
    return groups;
  }, {});

  const calculateWorkoutStats = (workout) => {
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const totalVolume = workout.exercises.reduce((sum, ex) => 
      sum + (ex.sets * ex.reps * ex.weight), 0
    );
    return { totalSets, totalVolume };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Workout History</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search workouts or exercises..."
              className="input-field"
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {Object.keys(groupedWorkouts).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏋️‍♂️</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No workouts found</h3>
            <p className="text-gray-500">
              {filter || selectedDate ? 'Try changing your filters' : 'Log your first workout to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => (
              <div key={date} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    {format(new Date(date), 'EEEE, MMMM do yyyy')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {dateWorkouts.length} workout{dateWorkouts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {dateWorkouts.map((workout) => {
                    const stats = calculateWorkoutStats(workout);
                    return (
                      <div key={workout.id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{workout.name}</h4>
                            <p className="text-sm text-gray-500">
                              {format(new Date(workout.timestamp), 'h:mm a')}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                              {stats.totalSets} sets
                            </span>
                            <span className="px-3 py-1 bg-secondary-100 text-secondary-800 text-sm font-medium rounded-full">
                              {stats.totalVolume.toFixed(0)} kg volume
                            </span>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this workout?')) {
                                  deleteWorkout(workout.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete workout"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {workout.exercises.map((exercise, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-medium text-gray-900">{exercise.name}</span>
                                {exercise.notes && (
                                  <span className="text-gray-500 ml-2">— {exercise.notes}</span>
                                )}
                              </div>
                              <div className="text-gray-700">
                                {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;