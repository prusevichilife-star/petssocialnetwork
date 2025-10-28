import React from 'react';

const FlagIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 21v-4m0 0l5-3 5 3 5-3 5 3v4M3 21h18M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" 
        />
    </svg>
  );
};

export default FlagIcon;
