import React from 'react';

const PawIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21 12.25C21 8.243 17.757 5 13.75 5c-2.174 0-4.131.95-5.485 2.515C6.91 8.87 6 10.826 6 13c0 3.866 3.134 7 7 7 1.656 0 3.18-.573 4.38-1.557" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 11c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zM8 9c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zM16 9c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zM12 5c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z" 
        />
    </svg>
  );
};

export default PawIcon;