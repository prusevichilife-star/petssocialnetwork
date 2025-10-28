import React from 'react';

const CakeIcon: React.FC = () => {
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
            d="M21 15.243C21 16.764 19.764 18 18.243 18H5.757C4.236 18 3 16.764 3 15.243V10.5h18v4.743zM4 14h16M4 12h16M12 4v4m0 0a2 2 0 100 4 2 2 0 000-4z" 
        />
        <path
            strokeLinecap="round" 
            strokeLinejoin="round"
            d="M3 10.5V8a2 2 0 012-2h14a2 2 0 012 2v2.5" 
        />
    </svg>
  );
};

export default CakeIcon;