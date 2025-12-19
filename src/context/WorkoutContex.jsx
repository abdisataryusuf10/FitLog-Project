import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setWorkouts([]);
      setWorkoutTemplates([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = () => {
    try {
      const userWorkouts = JSON.parse(localStorage.getItem(`fitlog_workouts_${user.id}`) || '[]');
      const userTemplates = JSON.parse(localStorage.getItem(`fitlog_templates_${user.id}`) || '[]');
      
      setWorkouts(userWorkouts);
      setWorkoutTemplates(userTemplates);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkouts = (updatedWorkouts) => {
    setWorkouts(updatedWorkouts);
    if (user) {
      localStorage.setItem(`fitlog_workouts_${user.id}`, JSON.stringify(updatedWorkouts));
    }
  };

  const saveTemplates = (updatedTemplates) => {
    setWorkoutTemplates(updatedTemplates);
    if (user) {
      localStorage.setItem(`fitlog_templates_${user.id}`, JSON.stringify(updatedTemplates));
    }
  };

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      userId: user?.id,
      timestamp: new Date().toISOString()
    };
    
    const updatedWorkouts = [...workouts, newWorkout];
    saveWorkouts(updatedWorkouts);
  };

  const updateWorkout = (updatedWorkout) => {
    const updatedWorkouts = workouts.map(workout => 
      workout.id === updatedWorkout.id ? { ...updatedWorkout } : workout
    );
    saveWorkouts(updatedWorkouts);
  };

  const deleteWorkout = (workoutId) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== workoutId);
    saveWorkouts(updatedWorkouts);
  };

  const deleteMultipleWorkouts = (workoutIds) => {
    const updatedWorkouts = workouts.filter(workout => !workoutIds.includes(workout.id));
    saveWorkouts(updatedWorkouts);
  };

  const duplicateWorkout = (workoutId) => {
    const workoutToDuplicate = workouts.find(w => w.id === workoutId);
    if (workoutToDuplicate) {
      const duplicatedWorkout = {
        ...workoutToDuplicate,
        id: Date.now(),
        name: `${workoutToDuplicate.name} (Copy)`,
        timestamp: new Date().toISOString()
      };
      const updatedWorkouts = [...workouts, duplicatedWorkout];
      saveWorkouts(updatedWorkouts);
    }
  };

  const saveAsTemplate = (workout) => {
    const template = {
      ...workout,
      id: Date.now(),
      isTemplate: true,
      userId: user?.id,
      createdAt: new Date().toISOString()
    };
    const updatedTemplates = [...workoutTemplates, template];
    saveTemplates(updatedTemplates);
  };

  const loadFromTemplate = (templateId) => {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (template) {
      const workout = {
        ...template,
        id: Date.now(),
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        timestamp: new Date().toISOString(),
        isTemplate: false
      };
      addWorkout(workout);
    }
  };

  const getWorkoutStats = () => {
    const totalWorkouts = workouts.length;
    const totalExercises = workouts.reduce((sum, workout) => 
      sum + workout.exercises.length, 0
    );
    const totalWeightLifted = workouts.reduce((sum, workout) => 
      sum + workout.exercises.reduce((exSum, exercise) => 
        exSum + (exercise.sets * exercise.reps * exercise.weight), 0
      ), 0
    );
    const averageSets = totalWorkouts > 0 
      ? workouts.reduce((sum, workout) => 
          sum + workout.exercises.reduce((exSum, exercise) => exSum + exercise.sets, 0), 0
        ) / totalWorkouts 
      : 0;

    return {
      totalWorkouts,
      totalExercises,
      totalWeightLifted,
      averageSets: averageSets.toFixed(1)
    };
  };

  return (
    <WorkoutContext.Provider value={{ 
      workouts,
      workoutTemplates,
      loading,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      deleteMultipleWorkouts,
      duplicateWorkout,
      saveAsTemplate,
      loadFromTemplate,
      getWorkoutStats
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};