import React from 'react';

const TagIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M14 11h6m-3-3l3 3-3 3" 
        />
    </svg>
  );
};

export default TagIcon;