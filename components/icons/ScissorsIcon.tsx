import React from 'react';

const ScissorsIcon: React.FC = () => {
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
            d="M14.121 14.121L19 19m-7.071-7.071l-5.657-5.657M12 12a2 2 0 100-4 2 2 0 000 4zm0 0a2 2 0 110 4 2 2 0 010-4zm0 0L8.464 8.464" 
        />
    </svg>
  );
};

export default ScissorsIcon;
