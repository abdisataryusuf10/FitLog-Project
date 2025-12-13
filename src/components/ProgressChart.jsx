import React from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { format, subDays, startOfDay } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ProgressChart = () => {
  const { workouts, getWorkoutStats } = useWorkouts();
  const stats = getWorkoutStats();

  // Prepare data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(startOfDay(new Date()), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayWorkouts = workouts.filter(workout => 
      format(startOfDay(new Date(workout.timestamp)), 'yyyy-MM-dd') === dateStr
    );
    
    const volume = dayWorkouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((sum, exercise) => {
        return sum + (exercise.sets * exercise.reps * exercise.weight);
      }, 0);
    }, 0);
    
    const totalSets = dayWorkouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
    }, 0);

    return {
      date: format(date, 'EEE'),
      fullDate: dateStr,
      volume,
      totalSets,
      workouts: dayWorkouts.length,
    };
  }).reverse();

  // Calculate weekly totals
  const weeklyVolume = last7Days.reduce((sum, day) => sum + day.volume, 0);
  const weeklyWorkouts = last7Days.reduce((sum, day) => sum + day.workouts, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Workouts</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalWorkouts}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Exercises</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalExercises}</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Volume</h3>
          <p className="text-3xl font-bold text-gray-900">
            {parseInt(stats.totalWeightLifted).toLocaleString()} kg
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Weekly Workouts</h3>
          <p className="text-3xl font-bold text-gray-900">{weeklyWorkouts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Over Last 7 Days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Volume']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Volume (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workouts & Sets</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="workouts" fill="#ec4899" name="Workouts" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalSets" fill="#f59e0b" name="Sets" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workouts
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sets
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume (kg)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {last7Days.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{day.date}</div>
                    <div className="text-sm text-gray-500">{day.fullDate}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      day.workouts > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {day.workouts} workout{day.workouts !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {day.totalSets}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {day.volume.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {day.volume > 0 ? (
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                        Rest Day
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td className="px-4 py-3 whitespace-nowrap">Total</td>
                <td className="px-4 py-3 whitespace-nowrap">{weeklyWorkouts}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {last7Days.reduce((sum, day) => sum + day.totalSets, 0)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{weeklyVolume.toFixed(0)} kg</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium text-primary-800 bg-primary-100 rounded-full">
                    Weekly Total
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;