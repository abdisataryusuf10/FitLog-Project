import React, { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';

const WorkoutList = ({ onSelect, selectionMode = false, selectedIds = [], onToggleSelect }) => {
  const { workouts } = useWorkouts();

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Select workouts for bulk operations:</p>
      {workouts.map(workout => (
        <div 
          key={workout.id}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selectionMode && selectedIds.includes(workout.id)
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => {
            if (selectionMode) {
              onToggleSelect(workout.id);
            } else {
              onSelect([workout]);
            }
          }}
        >
          <div className="flex items-start">
            {selectionMode && (
              <input
                type="checkbox"
                checked={selectedIds.includes(workout.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelect(workout.id);
                }}
                className="mt-1 mr-3 h-4 w-4 text-primary-600 rounded"
              />
            )}
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{workout.name}</h3>
                <span className="text-sm text-gray-500">
                  {workout.exercises.length} exercises
                </span>
              </div>
              {workout.notes && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{workout.notes}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;