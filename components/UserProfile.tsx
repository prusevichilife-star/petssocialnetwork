import React from 'react';
import { User, Pet, PrivacySettings, Visibility } from '../types';
import PrivacySettingsComponent from './PrivacySettings';
import LockIcon from './icons/LockIcon';

interface UserProfileProps {
  user: User;
  currentUser: User;
  onReturnToFeed: () => void;
  onUpdatePrivacySettings: (userId: string, section: keyof PrivacySettings, visibility: Visibility) => void;
  onViewPet: (pet: Pet) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, currentUser, onReturnToFeed, onUpdatePrivacySettings, onViewPet }) => {
  const isOwner = currentUser.id === user.id;
  const isFriend = user.friends.includes(currentUser.id);

  const canView = (section: keyof PrivacySettings): boolean => {
    if (isOwner) return true;
    const visibility = user.privacySettings[section];
    if (visibility === 'public') return true;
    if (visibility === 'friends' && isFriend) return true;
    return false;
  };

  const canViewBasics = canView('profileBasics');
  const canViewPets = canView('pets');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={onReturnToFeed}
        className="mb-6 px-4 py-2 text-sm bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        &larr; Back to Feed
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {canViewBasics ? (
          <div className="flex items-center space-x-6">
            <img className="h-24 w-24 rounded-full" src={user.avatarUrl} alt={user.name} />
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-md text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>
        ) : (
           <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <LockIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Private User</h1>
              <p className="text-md">@{user.username}</p>
            </div>
          </div>
        )}
      </div>
      
      {isOwner && (
        <PrivacySettingsComponent 
            settings={user.privacySettings}
            onUpdate={(section, visibility) => onUpdatePrivacySettings(user.id, section, visibility)}
        />
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Pets</h2>
        {canViewPets ? (
            user.pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {user.pets.map(pet => (
                  <div 
                    key={pet.id} 
                    onClick={() => onViewPet(pet)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200"
                    role="button"
                    tabIndex={0}
                    aria-label={`View profile for ${pet.name}`}
                  >
                    <img className="h-16 w-16 rounded-full" src={pet.avatarUrl} alt={pet.name} />
                    <div>
                      <p className="font-bold text-lg">{pet.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed}</p>
                    </div>
                  </div>
                ))}
            </div>
            ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">{isOwner ? "You haven't" : `${user.name} hasn't`} added any pets yet.</p>
            </div>
            )
        ) : (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="flex justify-center items-center text-gray-500 dark:text-gray-400">
                    <LockIcon />
                    <p className="ml-2">This user's pets are private.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;