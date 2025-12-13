import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LogWorkoutPage from './pages/LogWorkout';
import HistoryPage from './pages/History';
import ExercisesPage from './pages/Exercises';

function App() {
  return (
    <WorkoutProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/log-workout" element={<LogWorkoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>FitLog Fitness Tracker • Built with React & Tailwind CSS</p>
              <p className="text-sm mt-2">Using WGER API for exercise data</p>
            </div>
          </footer>
        </div>
      </Router>
    </WorkoutProvider>
  );
}

export default App;