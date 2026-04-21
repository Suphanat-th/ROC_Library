import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className={`${sizeClasses[size]} relative`}>
        <div
          className="w-full h-full rounded-full border-4 border-blue-500 border-t-blue-700 border-r-blue-700 animate-spin"
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-blue-400 border-b-blue-600 border-l-blue-600"
          style={{
            animation: 'spin 2s linear infinite reverse',
          }}
        />
      </div>

      {/* Message */}
      {message && (
        <p className="text-blue-600 font-semibold text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-white/30 backdrop-blur-md shadow-xl shadow-purple-500/30 border border-white/40 rounded-2xl p-8">
          {loaderContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {loaderContent}
    </div>
  );
};

export default Loader;
