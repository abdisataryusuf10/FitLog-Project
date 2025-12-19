import React, { useState, useEffect } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';

const EditWorkoutModal = ({ workout, onClose }) => {
  const { updateWorkout } = useWorkouts();
  const [formData, setFormData] = useState({
    id: workout.id,
    name: workout.name,
    exercises: [...workout.exercises],
    notes: workout.notes || ''
  });

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.exercises.length === 0) {
      alert('Please enter a workout name and add at least one exercise');
      return;
    }
    updateWorkout(formData);
    onClose();
  };

  const handleUpdateExercise = (index, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[index][field] = value;
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) {
      alert('Please enter an exercise name');
      return;
    }
    const updatedExercises = [...formData.exercises, { ...newExercise }];
    setFormData({ ...formData, exercises: updatedExercises });
    setNewExercise({ name: '', sets: 3, reps: 10, weight: 0, notes: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Workout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="input-field min-h-[100px]"
                placeholder="Add any notes about this workout..."
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercises</h3>
              
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={exercise.sets}
                        onChange={(e) => handleUpdateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                        className="input-field text-sm py-1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={exercise.reps}
                        onChange={(e) => handleUpdateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                        className="input-field text-sm py-1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => handleUpdateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                        className="input-field text-sm py-1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={exercise.notes}
                        onChange={(e) => handleUpdateExercise(index, 'notes', e.target.value)}
                        className="input-field text-sm py-1"
                        placeholder="Notes"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border border-gray-300 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Add New Exercise</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                    className="input-field text-sm"
                    placeholder="Exercise name"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({...newExercise, sets: parseInt(e.target.value) || 1})}
                      className="input-field text-sm"
                      placeholder="Sets"
                    />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({...newExercise, reps: parseInt(e.target.value) || 1})}
                      className="input-field text-sm"
                      placeholder="Reps"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({...newExercise, weight: parseFloat(e.target.value) || 0})}
                      className="input-field text-sm"
                      placeholder="Weight"
                    />
                  </div>
                  <input
                    type="text"
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})}
                    className="input-field text-sm"
                    placeholder="Notes (optional)"
                  />
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="btn-secondary w-full text-sm py-2"
                  >
                    Add Exercise
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWorkoutModal;