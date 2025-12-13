// WGER API utility functions
const API_BASE = 'https://wger.de/api/v2';

export const fetchExercises = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      language: 2,
      limit: 100,
      ...params
    }).toString();

    const response = await fetch(`${API_BASE}/exercise/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch exercises');
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchExerciseDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/exerciseinfo/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch exercise details');
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchMuscleGroups = async () => {
  try {
    const response = await fetch(`${API_BASE}/muscle/`);
    if (!response.ok) throw new Error('Failed to fetch muscle groups');
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};