import React from 'react';

const BeakerIcon: React.FC = () => {
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
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.037-.502.068-.75.097h-1.5c-.375 0-.695.107-.983.284M14.25 3.104v5.714c0 .597.237 1.17.659 1.591l4.091 4.092c.22.22.22.577 0 .796l-1.06 1.06c-.22.22-.577.22-.796 0l-4.091-4.092a2.25 2.25 0 01-.659-1.591V3.104c.251.037.502.068.75.097h1.5c.375 0 .695.107.983.284" 
        />
    </svg>
  );
};

export default BeakerIcon;
