import React from 'react';

export const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinnerMarkup = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${sizeClasses[size] || sizeClasses.md}`}>
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Inner Static Dimmed Ring */}
        <div className="absolute inset-0 rounded-full border-slate-800 border-solid"></div>
      </div>
      {fullScreen && (
        <p className="text-slate-400 font-medium text-sm tracking-wide animate-pulse">
          Loading Community Ticket Management System...
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center animated-bg">
        {spinnerMarkup}
      </div>
    );
  }

  return spinnerMarkup;
};

// Sleek loading skeleton loader for lists and tables
export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse p-4">
      {/* Table Header Skeleton */}
      <div className="flex space-x-4 mb-6">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-5 bg-slate-800 rounded flex-1"></div>
        ))}
      </div>
      {/* Table Body Skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 py-3 border-b border-slate-800/45">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-slate-800/60 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
