import React from 'react';

interface DirectionArrowProps {
  degrees: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DirectionArrow: React.FC<DirectionArrowProps> = ({ 
  degrees, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        className={`${sizeClasses[size]} transform`}
        style={{ transform: `rotate(${degrees}deg)` }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3l8 18H4z" />
      </svg>
    </div>
  );
};

export default DirectionArrow; 