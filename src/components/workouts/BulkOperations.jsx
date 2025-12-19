import React from 'react';

const BulkOperations = ({ selectedWorkouts, onDelete, onExport }) => {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default export functionality
      const data = JSON.stringify(selectedWorkouts, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workouts-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-medium">
            {selectedWorkouts.length}
          </div>
          <span className="font-medium text-blue-800">
            {selectedWorkouts.length} workout{selectedWorkouts.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Export Selected
          </button>
          <button 
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;