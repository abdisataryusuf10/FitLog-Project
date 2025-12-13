import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkoutContext = createContext();

export const useWorkouts = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('fitlog-workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fitlog-workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Fetch exercises from WGER API
  const fetchExercises = async (searchTerm = '', muscleGroup = '') => {
    setLoading(true);
    setError(null);
    try {
      let url = 'https://wger.de/api/v2/exercise/?language=2&limit=50';
      
      if (searchTerm) {
        url += `&name=${encodeURIComponent(searchTerm)}`;
      }
      
      if (muscleGroup) {
        url += `&muscles=${muscleGroup}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      
      const data = await response.json();
      setExercises(data.results);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new workout
  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  // Update an existing workout
  const updateWorkout = (id, updatedWorkout) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === id ? { ...workout, ...updatedWorkout } : workout
    ));
  };

  // Delete a workout
  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  // Get workouts for a specific date range
  const getWorkoutsByDateRange = (startDate, endDate) => {
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.timestamp);
      return workoutDate >= startDate && workoutDate <= endDate;
    });
  };

  // Calculate total weight lifted
  const getTotalWeightLifted = () => {
    return workouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((sum, exercise) => {
        return sum + (exercise.sets * exercise.reps * exercise.weight);
      }, 0);
    }, 0);
  };

  // Get workout statistics
  const getWorkoutStats = () => {
    const totalWorkouts = workouts.length;
    const totalExercises = workouts.reduce((sum, workout) => sum + workout.exercises.length, 0);
    const averageSets = workouts.length > 0 
      ? workouts.reduce((sum, workout) => {
          return sum + workout.exercises.reduce((setSum, exercise) => setSum + exercise.sets, 0);
        }, 0) / workouts.length
      : 0;

    return {
      totalWorkouts,
      totalExercises,
      averageSets: averageSets.toFixed(1),
      totalWeightLifted: getTotalWeightLifted().toFixed(0),
    };
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      exercises,
      loading,
      error,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      fetchExercises,
      getWorkoutsByDateRange,
      getWorkoutStats,
      getTotalWeightLifted,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};