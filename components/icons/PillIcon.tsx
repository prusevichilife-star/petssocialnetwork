import React from 'react';

const PillIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M10.5 21l5.25-11.25L21 21m-9-3.75h.008v.008h-.008v-.008z" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M6.375 18l5.25-11.25L17.25 18" 
        />
    </svg>
  );
};

export default PillIcon;
