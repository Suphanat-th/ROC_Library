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
          className="w-full h-full rounded-full border-4 border-primary/30 border-t-primary border-r-primary animate-spin"
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-b-primary/60 border-l-primary/60"
          style={{
            animation: 'spin 2s linear infinite reverse',
          }}
        />
      </div>

      {/* Message */}
      {message && (
        <p className="text-primary font-semibold text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base-content/30 backdrop-blur-sm z-50">
        <div className="bg-base-100/90 backdrop-blur-md shadow-xl border border-primary/30 rounded-box p-8">
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
