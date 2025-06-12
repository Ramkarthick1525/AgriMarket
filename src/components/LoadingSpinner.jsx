import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <Loader className={`animate-spin text-green-600 ${sizeClasses[size]}`} />
    </div>
  );
};

export default LoadingSpinner;