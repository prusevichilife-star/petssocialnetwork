
import React from 'react';
import { User, Pet } from '../types';
import { EnrichedActivity } from '../App';
import { timeAgo } from '../utils';
import HeartIcon from './icons/HeartIcon';
import FlagIcon from './icons/FlagIcon';
import PuzzlePieceIcon from './icons/PuzzlePieceIcon';
import MapIcon from './icons/MapIcon';
import ScissorsIcon from './icons/ScissorsIcon';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';

interface PetActivityCardProps {
  activity: EnrichedActivity;
  currentUser: User;
  onLike: (activityId: string) => void;
  onViewProfile: (user: User) => void;
  onViewPet: (pet: Pet) => void;
}

const activityIcons: Record<string, React.ReactNode> = {
  'Milestone': <FlagIcon />,
  'Playtime': <PuzzlePieceIcon />,
  'Adventure': <MapIcon />,
  'Grooming': <ScissorsIcon />,
};

const PetActivityCard: React.FC<PetActivityCardProps> = ({ activity, onLike, onViewProfile, onViewPet }) => {
  const { pet, user, title, description, photoUrl, date, category } = activity;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img 
            className="h-12 w-12 rounded-full cursor-pointer" 
            src={pet.avatarUrl} 
            alt={pet.name} 
            onClick={() => onViewPet(pet)}
          />
          <div className="ml-4">
            <p className="text-sm text-gray-900 dark:text-white">
              <span 
                className="font-bold cursor-pointer hover:underline" 
                onClick={() => onViewPet(pet)}
              >
                {pet.name}
              </span>
              <span> had a new {category.toLowerCase()} activity</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              with <span className="cursor-pointer hover:underline" onClick={() => onViewProfile(user)}>{user.name}</span> · {timeAgo(date)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-start">
             <div className="flex-shrink-0 mt-1 mr-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                {activityIcons[category] || <ClipboardDocumentListIcon />}
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
                {description && <p className="mt-1 text-gray-700 dark:text-gray-300">{description}</p>}
            </div>
          </div>
           {photoUrl && <img src={photoUrl} alt={title} className="mt-3 rounded-lg w-full object-cover max-h-80" />}
        </div>
        
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
        <button
          onClick={() => onLike(activity.id)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200"
        >
          <HeartIcon isLiked={activity.isLiked} />
          <span className={`font-semibold ${activity.isLiked ? 'text-red-500' : ''}`}>{activity.likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PetActivityCard;
