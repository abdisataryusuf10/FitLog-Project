import React, { useState, useEffect } from 'react';
import { fetchExercises, fetchMuscleGroups } from '../utils/api';

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchExercises();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedMuscle]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exercisesData, musclesData] = await Promise.all([
        fetchExercises(),
        fetchMuscleGroups()
      ]);
      setExercises(exercisesData.results);
      setMuscleGroups(musclesData.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchExercises = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedMuscle) params.muscles = selectedMuscle;
      
      const data = await fetchExercises(params);
      setExercises(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    return html?.replace(/<[^>]*>/g, '') || 'No description available';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Library</h1>
        <p className="text-gray-600">Browse exercises and learn proper form</p>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises by name..."
              className="input-field"
            />
          </div>
          
          <div>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="input-field"
            >
              <option value="">All Muscle Groups</option>
              {muscleGroups.map((muscle) => (
                <option key={muscle.id} value={muscle.id}>
                  {muscle.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            Error loading exercises: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading exercises...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No exercises found</h3>
            <p className="text-gray-500">Try a different search term or muscle group</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{exercise.name}</h3>
                    {exercise.muscles && exercise.muscles.length > 0 && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                        {exercise.muscles.length} muscle{exercise.muscles.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {stripHtml(exercise.description)}
                      </p>
                    </div>
                    
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Equipment</h4>
                        <div className="flex flex-wrap gap-1">
                          {exercise.equipment.map((eq, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {eq.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Category</h4>
                      <p className="text-sm text-gray-600">{exercise.category?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;