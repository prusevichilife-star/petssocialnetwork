
import React from 'react';

const CompassIcon: React.FC = () => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 21a9 9 0 100-18 9 9 0 000 18z" 
      />
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.485-7.485l-1.414 1.414M6.929 17.071l-1.414-1.414m11.556 0l-1.414-1.414M6.929 6.929L5.515 5.515" 
      />
       <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12l-3-3-3 3 3 3 3-3z"
      />
    </svg>
  );
};

export default CompassIcon;
