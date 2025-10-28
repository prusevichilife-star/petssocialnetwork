
import React from 'react';

interface HeartIconProps {
  isLiked: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({ isLiked }) => {
  return (
    <svg
      className={`w-6 h-6 transition-transform transform duration-200 ${isLiked ? 'scale-110' : 'scale-100'}`}
      fill={isLiked ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
      />
    </svg>
  );
};

export default HeartIcon;
