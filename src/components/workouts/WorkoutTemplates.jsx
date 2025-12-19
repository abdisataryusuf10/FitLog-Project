import React, { useState } from 'react';
import { useWorkouts } from '../../context/WorkoutContext';
import { format } from 'date-fns';

const WorkoutTemplates = () => {
  const { workoutTemplates, loadFromTemplate, deleteWorkout } = useWorkouts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = workoutTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const calculateVolume = (workout) => {
    return workout.exercises.reduce((sum, ex) => 
      sum + (ex.sets * ex.reps * ex.weight), 0
    );
  };

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Templates</h2>
          <p className="text-gray-600 dark:text-gray-400">Save and reuse your favorite workouts</p>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search templates..."
          className="input-field mt-2 md:mt-0 md:w-64"
        />
      </div>

      {workoutTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No templates yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Save a workout as a template to reuse it later</p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>To save a template:</p>
            <p>1. Go to Workout History</p>
            <p>2. Click "Save as Template" on any workout</p>
          </div>
        </div>
      ) : (
        <>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">🔍</div>
              <p className="text-gray-600 dark:text-gray-400">No templates match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h3>
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-xs font-medium rounded-full">
                        {template.exercises.length} ex
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {template.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">{exercise.name}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            {exercise.sets}×{exercise.reps} @ {exercise.weight}kg
                          </span>
                        </div>
                      ))}
                      {template.exercises.length > 3 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +{template.exercises.length - 3} more exercises
                        </p>
                      )}
                    </div>
                    
                    {template.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 border-t dark:border-gray-700 pt-3">
                        📝 {template.notes}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created {format(new Date(template.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadFromTemplate(template.id)}
                          className="px-3 py-1 bg-primary-600 dark:bg-primary-700 text-white text-sm rounded-lg hover:bg-primary-700 dark:hover:bg-primary-800 transition-colors"
                        >
                          Use Template
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this template?')) {
                              deleteWorkout(template.id);
                            }
                          }}
                          className="px-3 py-1 text-red-600 dark:text-red-400 text-sm hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutTemplates;