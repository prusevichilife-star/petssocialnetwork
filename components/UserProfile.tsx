
import React from 'react';
import { User, Pet, PrivacySettings, Visibility } from '../types';
import PrivacySettingsComponent from './PrivacySettings';
import LockIcon from './icons/LockIcon';
import UsersIcon from './icons/UsersIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import ChatBubbleLeftRightIcon from './icons/ChatBubbleLeftRightIcon';

interface UserProfileProps {
  user: User;
  currentUser: User;
  allUsers: User[];
  onReturnToFeed: () => void;
  onUpdatePrivacySettings: (userId: string, section: keyof PrivacySettings, visibility: Visibility) => void;
  onViewPet: (pet: Pet) => void;
  onSendFriendRequest: (toUserId: string) => void;
  onRespondToFriendRequest: (requestId: string, accepted: boolean) => void;
  onOpenPlaydateModal: (user: User, pet: Pet) => void;
  onStartConversation: (userId: string) => void;
  onViewProfile: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
    user, 
    currentUser, 
    allUsers,
    onReturnToFeed, 
    onUpdatePrivacySettings, 
    onViewPet,
    onSendFriendRequest,
    onRespondToFriendRequest,
    onOpenPlaydateModal,
    onStartConversation,
    onViewProfile,
}) => {
  const isOwner = currentUser.id === user.id;
  const areFriends = user.friends.includes(currentUser.id);
  
  const outgoingRequest = currentUser.outgoingFriendRequests.some(reqId => 
    Object.values(allUsers).some(u => u.id === user.id && u.incomingFriendRequests.includes(reqId))
  );
    
  const incomingRequest = currentUser.incomingFriendRequests.find(reqId => 
    user.outgoingFriendRequests.includes(reqId)
  );


  const canView = (section: keyof PrivacySettings): boolean => {
    if (isOwner) return true;
    const visibility = user.privacySettings[section];
    if (visibility === 'public') return true;
    if (visibility === 'friends' && areFriends) return true;
    return false;
  };

  const canViewBasics = canView('profileBasics');
  const canViewPets = canView('pets');
  const canViewFriends = canView('friends');

  const FriendshipActionButton: React.FC = () => {
    if (isOwner) return null;
    if (areFriends) {
      return (
        <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold rounded-full inline-flex items-center">Friends</span>
            <button 
                onClick={() => onStartConversation(user.id)}
                className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full inline-flex items-center">
                <ChatBubbleLeftRightIcon /> <span className="ml-2 hidden sm:inline">Message</span>
            </button>
        </div>
      );
    }
    if (outgoingRequest) {
      return <span className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full">Request Sent</span>;
    }
    if (incomingRequest) {
      return (
        <div className="flex space-x-2">
            <button onClick={() => onRespondToFriendRequest(incomingRequest, true)} className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full">Accept</button>
            <button onClick={() => onRespondToFriendRequest(incomingRequest, false)} className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full">Decline</button>
        </div>
      );
    }
    return <button onClick={() => onSendFriendRequest(user.id)} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full inline-flex items-center"><UserPlusIcon /> Add Friend</button>;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={onReturnToFeed}
        className="mb-6 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        &larr; Back to Feed
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
            {canViewBasics ? (
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-6">
                <img className="h-24 w-24 rounded-full" src={user.avatarUrl} alt={user.name} />
                <div className="mt-4 sm:mt-0">
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
            <div className="mt-4 sm:mt-0">
                <FriendshipActionButton />
            </div>
        </div>
      </div>
      
      {isOwner && (
        <PrivacySettingsComponent 
            settings={user.privacySettings}
            onUpdate={(section, visibility) => onUpdatePrivacySettings(user.id, section, visibility)}
        />
      )}

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Pets</h2>
            {canViewPets ? (
                user.pets.length > 0 ? (
                <div className="space-y-4">
                    {user.pets.map(pet => (
                      <div key={pet.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                        <div 
                          className="flex items-center space-x-4 cursor-pointer group"
                          onClick={() => onViewPet(pet)}
                        >
                          <img className="h-16 w-16 rounded-full group-hover:scale-105 transition-transform" src={pet.avatarUrl} alt={pet.name} />
                          <div>
                            <p className="font-bold text-lg group-hover:text-indigo-500">{pet.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed}</p>
                          </div>
                        </div>
                        {areFriends && !isOwner && pet.privacySettings.playdates === 'friends' && (
                            <button 
                                onClick={() => onOpenPlaydateModal(user, pet)}
                                className="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">
                                Request Playdate
                            </button>
                        )}
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
        <div>
            <h2 className="text-2xl font-bold mb-4">Friends ({user.friends.length})</h2>
            {canViewFriends ? (
                user.friends.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                        <div className="grid grid-cols-3 gap-4">
                            {user.friends.slice(0, 9).map(friendId => {
                                const friend = allUsers.find(u => u.id === friendId);
                                if (!friend) return null;
                                return (
                                    <div key={friendId} className="flex flex-col items-center text-center cursor-pointer" onClick={() => onViewProfile(friend)}>
                                        <img className="h-16 w-16 rounded-full" src={friend.avatarUrl} alt={friend.name} />
                                        <p className="text-sm font-medium mt-2 truncate w-full hover:underline">{friend.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                        {user.friends.length > 9 && (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">... and {user.friends.length - 9} more friends</p>
                        )}
                    </div>
                ) : (
                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                        <UsersIcon />
                        <p className="text-gray-500 dark:text-gray-400 mt-2">{isOwner ? "You haven't" : `${user.name} hasn't`} added any friends yet.</p>
                    </div>
                )
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                    <div className="flex justify-center items-center text-gray-500 dark:text-gray-400">
                        <LockIcon />
                        <p className="ml-2">This user's friends list is private.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
