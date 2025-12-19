import React, { useState } from 'react';
import { useWorkouts } from '../context/WorkoutContext';
import { format, subWeeks, startOfDay, eachDayOfInterval } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ProgressComparisonChart = () => {
  const { workouts } = useWorkouts();
  const [timeRange, setTimeRange] = useState('week'); // week, month, quarter
  const [comparisonType, setComparisonType] = useState('volume'); // volume, sets, workouts

  const getDateRange = () => {
    const today = startOfDay(new Date());
    let startDate;
    
    switch(timeRange) {
      case 'month':
        startDate = subWeeks(today, 4);
        break;
      case 'quarter':
        startDate = subWeeks(today, 12);
        break;
      default: // week
        startDate = subWeeks(today, 1);
    }
    
    return eachDayOfInterval({ start: startDate, end: today });
  };

  const prepareComparisonData = () => {
    const dates = getDateRange();
    const currentPeriod = dates.slice(-7); // Last 7 days for current period
    const previousPeriod = dates.slice(-14, -7); // Previous 7 days for comparison
    
    const calculatePeriodStats = (periodDates) => {
      return periodDates.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayWorkouts = workouts.filter(workout => 
          workout.timestamp && format(startOfDay(new Date(workout.timestamp)), 'yyyy-MM-dd') === dateStr
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
      });
    };

    const currentStats = calculatePeriodStats(currentPeriod);
    const previousStats = calculatePeriodStats(previousPeriod);
    
    // Combine data for comparison
    return currentStats.map((current, index) => {
      const previous = previousStats[index] || {};
      const volumeChange = previous.volume ? 
        ((current.volume - previous.volume) / previous.volume * 100).toFixed(1) : 0;
      const setsChange = previous.totalSets ? 
        ((current.totalSets - previous.totalSets) / previous.totalSets * 100).toFixed(1) : 0;
      
      return {
        ...current,
        previousVolume: previous.volume || 0,
        previousSets: previous.totalSets || 0,
        previousWorkouts: previous.workouts || 0,
        volumeChange: parseFloat(volumeChange),
        setsChange: parseFloat(setsChange),
      };
    });
  };

  const data = prepareComparisonData();
  
  const getComparisonColor = (value) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getChartDataKey = () => {
    switch(comparisonType) {
      case 'sets': return 'totalSets';
      case 'workouts': return 'workouts';
      default: return 'volume';
    }
  };

  const getPreviousDataKey = () => {
    switch(comparisonType) {
      case 'sets': return 'previousSets';
      case 'workouts': return 'previousWorkouts';
      default: return 'previousVolume';
    }
  };

  const getChangeKey = () => {
    switch(comparisonType) {
      case 'sets': return 'setsChange';
      case 'workouts': return 'volumeChange'; // Simplified for now
      default: return 'volumeChange';
    }
  };

  const getYAxisLabel = () => {
    switch(comparisonType) {
      case 'sets': return 'Number of Sets';
      case 'workouts': return 'Number of Workouts';
      default: return 'Volume (kg)';
    }
  };

  const calculateTotalChange = () => {
    const currentTotal = data.reduce((sum, day) => sum + day[getChartDataKey()], 0);
    const previousTotal = data.reduce((sum, day) => sum + day[getPreviousDataKey()], 0);
    
    if (previousTotal === 0) return 0;
    return ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);
  };

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
          Progress Comparison
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field py-1.5 text-sm"
          >
            <option value="week">Last Week vs Previous</option>
            <option value="month">Last Month vs Previous</option>
            <option value="quarter">Last Quarter vs Previous</option>
          </select>
          
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            className="input-field py-1.5 text-sm"
          >
            <option value="volume">Volume (kg)</option>
            <option value="sets">Total Sets</option>
            <option value="workouts">Workout Count</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Period</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, day) => sum + day[getChartDataKey()], 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getYAxisLabel()}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Previous Period</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, day) => sum + day[getPreviousDataKey()], 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getYAxisLabel()}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Change</h4>
          <p className={`text-2xl font-bold ${getComparisonColor(calculateTotalChange())}`}>
            {calculateTotalChange()}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Compared to previous period</p>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
              label={{ 
                value: getYAxisLabel(), 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#6b7280' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => {
                const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
                return [formattedValue, name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={getChartDataKey()}
              name="Current Period"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={getPreviousDataKey()}
              name="Previous Period"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Day
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Current
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Previous
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {data.map((day, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{day.date}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{day.fullDate}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {day[getChartDataKey()].toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {day[getPreviousDataKey()].toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    day[getChangeKey()] > 0 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                      : day[getChangeKey()] < 0
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                  }`}>
                    {day[getChangeKey()] > 0 ? '↑' : day[getChangeKey()] < 0 ? '↓' : '→'}
                    {Math.abs(day[getChangeKey()])}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressComparisonChart;