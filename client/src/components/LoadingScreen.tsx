import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
      <div className="text-center">
        {/* Spinner - simple CSS spinner */}
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-green-400 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;