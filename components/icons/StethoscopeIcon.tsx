import React from 'react';

const StethoscopeIcon: React.FC = () => {
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0021.5 5.5V3.935m-18 0A2.25 2.25 0 015.25 2h13.5A2.25 2.25 0 0121 4.25v2.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 6.5V4.25a2.25 2.25 0 01-.25-1.02" 
        />
    </svg>
  );
};

export default StethoscopeIcon;
