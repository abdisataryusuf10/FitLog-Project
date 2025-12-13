import React, { useState, useEffect } from 'react';
import { useWorkouts } from '../context/WorkoutContext';

const WorkoutLog = () => {
  const { addWorkout, fetchExercises, exercises, loading } = useWorkouts();
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');

  const muscleGroups = [
    { id: 1, name: 'Biceps' },
    { id: 2, name: 'Triceps' },
    { id: 3, name: 'Shoulders' },
    { id: 4, name: 'Chest' },
    { id: 5, name: 'Back' },
    { id: 6, name: 'Quadriceps' },
    { id: 7, name: 'Hamstrings' },
    { id: 8, name: 'Calves' },
    { id: 9, name: 'Abs' },
  ];

  useEffect(() => {
    fetchExercises(searchTerm, selectedMuscle);
  }, [searchTerm, selectedMuscle]);

  const handleAddExercise = (exercise) => {
    const newExercise = {
      id: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      weight: 0,
      notes: '',
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  const handleUpdateExercise = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index][field] = value;
    setSelectedExercises(updatedExercises);
  };

  const handleRemoveExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!workoutName.trim() || selectedExercises.length === 0) {
      alert('Please enter a workout name and add at least one exercise');
      return;
    }

    const workout = {
      name: workoutName,
      exercises: selectedExercises,
      notes: '',
    };

    addWorkout(workout);
    
    // Reset form
    setWorkoutName('');
    setSelectedExercises([]);
    setSearchTerm('');
    
    alert('Workout logged successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Log New Workout</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="input-field"
              placeholder="e.g., Chest Day, Leg Day"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Exercises
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                placeholder="Search by name..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Muscle Group
              </label>
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="input-field"
              >
                <option value="">All Muscles</option>
                {muscleGroups.map((muscle) => (
                  <option key={muscle.id} value={muscle.id}>
                    {muscle.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading exercises...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {exercises.slice(0, 12).map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => handleAddExercise(exercise)}
                  className="bg-white border border-gray-300 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all text-left"
                >
                  <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {exercise.description?.replace(/<[^>]*>/g, '').substring(0, 60)}...
                  </p>
                </button>
              ))}
            </div>
          )}

          {selectedExercises.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Selected Exercises</h3>
              {selectedExercises.map((exercise, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={exercise.sets}
                        onChange={(e) => handleUpdateExercise(index, 'sets', parseInt(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={exercise.reps}
                        onChange={(e) => handleUpdateExercise(index, 'reps', parseInt(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => handleUpdateExercise(index, 'weight', parseFloat(e.target.value))}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) => handleUpdateExercise(index, 'notes', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Felt strong today"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={selectedExercises.length === 0}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutLog;