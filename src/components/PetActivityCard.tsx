import React from 'react';
import { EnrichedActivity, CurrentView } from '../App';
import { timeAgo } from '../utils';
import { HeartIcon, ChatBubbleOvalLeftIcon, ArrowUturnRightIcon, SparklesIcon, ScissorsIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, FlagIcon, PuzzlePieceIcon, MapIcon } from '@heroicons/react/24/solid';

interface PetActivityCardProps {
  activity: EnrichedActivity;
  onLike: (activityId: string) => void;
  onNavigate: (view: CurrentView, id: string) => void;
}

const activityIcons: Record<string, React.ReactNode> = {
  'Milestone': <FlagIcon className="h-5 w-5" />,
  'Playtime': <PuzzlePieceIcon className="h-5 w-5" />,
  'Adventure': <MapIcon className="h-5 w-5" />,
  'Grooming': <ScissorsIcon className="h-5 w-5" />,
};

const PetActivityCard: React.FC<PetActivityCardProps> = ({ activity, onLike, onNavigate }) => {
  const { pet, user, title, description, photoUrl, date, category } = activity;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img 
            className="h-12 w-12 rounded-full cursor-pointer" 
            src={pet.avatarUrl} 
            alt={pet.name} 
            onClick={() => onNavigate('pet', pet.id)}
          />
          <div className="ml-4">
            <p className="text-sm text-gray-900 dark:text-white">
              <span 
                className="font-bold cursor-pointer hover:underline" 
                onClick={() => onNavigate('pet', pet.id)}
              >
                {pet.name}
              </span>
              <span> had a new {category.toLowerCase()} activity</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              with <span className="cursor-pointer hover:underline" onClick={() => onNavigate('profile', user.id)}>{user.name}</span> · {timeAgo(date)}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-start">
             <div className="flex-shrink-0 mt-1 mr-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                {activityIcons[category] || <SparklesIcon className="h-5 w-5" />}
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{title}</h3>
                {description && <p className="mt-1 text-gray-700 dark:text-gray-300">{description}</p>}
            </div>
          </div>
           {photoUrl && <img src={photoUrl} alt={title} className="mt-3 rounded-lg w-full object-cover max-h-80" />}
        </div>
        
      </div>
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex space-x-6">
            <button onClick={() => onLike(activity.id)} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 group">
                {activity.isLiked ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6" />}
                <span className={`font-semibold group-hover:text-red-500 dark:group-hover:text-red-400 ${activity.isLiked ? 'text-red-500' : ''}`}>{activity.likeCount}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 group">
                <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                <span className="font-semibold group-hover:text-indigo-500 dark:group-hover:text-indigo-400">Comment</span>
            </button>
             <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200 group">
                <ArrowUturnRightIcon className="h-6 w-6" />
                <span className="font-semibold group-hover:text-green-500 dark:group-hover:text-green-400">Share</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default PetActivityCard;