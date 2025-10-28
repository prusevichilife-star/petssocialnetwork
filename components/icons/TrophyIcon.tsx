import React from 'react';

const TrophyIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8 text-yellow-500"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M16 8v1.5a2.5 2.5 0 005 0V8M8 8v1.5a2.5 2.5 0 01-5 0V8m5 1.5A2.5 2.5 0 018 8v1.5M16 9.5A2.5 2.5 0 0013.5 12H10.5A2.5 2.5 0 008 9.5M12 15V9" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9 21h6v-6H9v6z" 
        />
    </svg>
  );
};

export default TrophyIcon;
