import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { format } from 'date-fns';
import EditWorkoutModal from './workouts/EditWorkoutModal';
import DeleteConfirmationModal from './workouts/DeleteConfirmationModal';
import BulkOperations from './workouts/BulkOperations';

const WorkoutHistory = () => {
  const { workouts, deleteWorkout, deleteMultipleWorkouts, duplicateWorkout, saveAsTemplate } = useWorkouts();
  const [filter, setFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, workoutId: null, workoutName: '' });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ isOpen: false, count: 0 });

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(filter.toLowerCase()) ||
      workout.exercises.some(ex => ex.name.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesDate = !selectedDate || 
      format(new Date(workout.timestamp), 'yyyy-MM-dd') === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  const handleSelectWorkout = (workoutId, checked) => {
    if (checked) {
      setSelectedWorkouts([...selectedWorkouts, workoutId]);
    } else {
      setSelectedWorkouts(selectedWorkouts.filter(id => id !== workoutId));
    }
  };

  const handleSelectAll = (dateWorkouts) => {
    const allIds = dateWorkouts.map(w => w.id);
    const allSelected = dateWorkouts.every(w => selectedWorkouts.includes(w.id));
    
    if (allSelected) {
      setSelectedWorkouts(selectedWorkouts.filter(id => !allIds.includes(id)));
    } else {
      const newSelections = allIds.filter(id => !selectedWorkouts.includes(id));
      setSelectedWorkouts([...selectedWorkouts, ...newSelections]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedWorkouts.length > 0) {
      deleteMultipleWorkouts(selectedWorkouts);
      setSelectedWorkouts([]);
      setBulkDeleteModal({ isOpen: false, count: 0 });
    }
  };

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

        {selectedWorkouts.length > 0 && (
          <div className="mb-6">
            <BulkOperations 
              selectedWorkouts={selectedWorkouts}
              onDelete={() => setBulkDeleteModal({ isOpen: true, count: selectedWorkouts.length })}
            />
          </div>
        )}

        {filteredWorkouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏋️‍♂️</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No workouts found</h3>
            <p className="text-gray-500">
              {filter || selectedDate ? 'Try changing your filters' : 'Log your first workout to get started!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredWorkouts.reduce((groups, workout) => {
              const date = format(new Date(workout.timestamp), 'yyyy-MM-dd');
              if (!groups[date]) {
                groups[date] = [];
              }
              groups[date].push(workout);
              return groups;
            }, {})).map(([date, dateWorkouts]) => (
              <div key={date} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {format(new Date(date), 'EEEE, MMMM do yyyy')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {dateWorkouts.length} workout{dateWorkouts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectAll(dateWorkouts)}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                  >
                    {dateWorkouts.every(w => selectedWorkouts.includes(w.id)) 
                      ? 'Deselect All' 
                      : 'Select All'}
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {dateWorkouts.map((workout) => {
                    const stats = calculateWorkoutStats(workout);
                    const isSelected = selectedWorkouts.includes(workout.id);
                    
                    return (
                      <div key={workout.id} className={`p-6 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start mb-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectWorkout(workout.id, e.target.checked)}
                            className="mt-1 mr-3 h-4 w-4 text-primary-600 rounded"
                          />
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
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
                              </div>
                            </div>
                            
                            {workout.notes && (
                              <p className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                📝 {workout.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3 ml-7">
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
                        
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => setEditingWorkout(workout)}
                            className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => duplicateWorkout(workout.id)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => saveAsTemplate(workout)}
                            className="px-3 py-1 text-sm text-green-600 hover:text-green-800 font-medium"
                          >
                            Save as Template
                          </button>
                          <button
                            onClick={() => setDeleteModal({ 
                              isOpen: true, 
                              workoutId: workout.id, 
                              workoutName: workout.name 
                            })}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
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

      {editingWorkout && (
        <EditWorkoutModal
          workout={editingWorkout}
          onClose={() => setEditingWorkout(null)}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, workoutId: null, workoutName: '' })}
        onConfirm={() => {
          deleteWorkout(deleteModal.workoutId);
          setSelectedWorkouts(selectedWorkouts.filter(id => id !== deleteModal.workoutId));
        }}
        itemName={deleteModal.workoutName}
      />

      <DeleteConfirmationModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={() => setBulkDeleteModal({ isOpen: false, count: 0 })}
        onConfirm={handleBulkDelete}
        itemName={`${bulkDeleteModal.count} Workouts`}
        count={bulkDeleteModal.count}
      />
    </div>
  );
};

export default WorkoutHistory;