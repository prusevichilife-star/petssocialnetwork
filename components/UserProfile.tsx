
import React from 'react';
import { User, Pet, PrivacySettings, Visibility } from '../types';
import { CurrentView } from '../App';
import PrivacySettingsComponent from './PrivacySettings';
import LockClosedIcon from './icons/LockClosedIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import ChatBubbleOvalLeftEllipsisIcon from './icons/ChatBubbleOvalLeftEllipsisIcon';
import CheckIcon from './icons/CheckIcon';
import RequestPlaydateModal from './RequestPlaydateModal';

interface UserProfileProps {
  user: User;
  currentUser: User;
  allUsers: User[];
  onNavigate: (view: CurrentView, id?: string) => void;
  onUpdatePrivacySettings: (userId: string, section: keyof PrivacySettings, visibility: Visibility) => void;
  onSendFriendRequest: (toUserId: string) => void;
  onRespondToFriendRequest: (requestId: string, accepted: boolean) => void;
  onSendPlaydateRequest: (fromPetId: string, toUserId: string, toPetId: string, date: string, location: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
    user, 
    currentUser, 
    allUsers,
    onNavigate,
    onUpdatePrivacySettings, 
    onSendFriendRequest,
    onRespondToFriendRequest,
    onSendPlaydateRequest,
}) => {
  const isOwner = currentUser.id === user.id;
  const areFriends = user.friends.includes(currentUser.id);
  
  const [isPlaydateModalOpen, setIsPlaydateModalOpen] = React.useState(false);
  const [playdateTarget, setPlaydateTarget] = React.useState<Pet | null>(null);
  
  const outgoingRequest = currentUser.outgoingFriendRequests.some(req => req.toUserId === user.id);
  const incomingRequest = currentUser.incomingFriendRequests.find(req => req.fromUserId === user.id);

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

  const handleOpenPlaydateModal = (pet: Pet) => {
    setPlaydateTarget(pet);
    setIsPlaydateModalOpen(true);
  };

  const handleSendPlaydate = (fromPetId: string, date: string, location: string) => {
    if (!playdateTarget) return;
    onSendPlaydateRequest(fromPetId, user.id, playdateTarget.id, date, location);
    setIsPlaydateModalOpen(false);
    setPlaydateTarget(null);
  };

  const FriendshipActionButton: React.FC = () => {
    if (isOwner) return null;
    if (areFriends) {
      return (
        <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 font-semibold rounded-full inline-flex items-center"><CheckIcon className="h-4 w-4 mr-1"/> Friends</span>
            <button 
                onClick={() => onNavigate('messages', user.id)}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full inline-flex items-center"
                title="Message"
                >
                <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
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
            <button onClick={() => onRespondToFriendRequest(incomingRequest.id, true)} className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full">Accept</button>
            <button onClick={() => onRespondToFriendRequest(incomingRequest.id, false)} className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 font-semibold rounded-full">Decline</button>
        </div>
      );
    }
    return <button onClick={() => onSendFriendRequest(user.id)} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full inline-flex items-center"><UserPlusIcon className="h-5 w-5 mr-2" /> Add Friend</button>;
  };

  return (
    <>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
          {canViewBasics ? (
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-6">
              <img className="h-24 w-24 rounded-full" src={user.avatarUrl} alt={user.name} />
              <div className="mt-4 sm:mt-0">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-md text-gray-500 dark:text-gray-400">@{user.username}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-lg">{user.bio}</p>
              </div>
            </div>
          ) : (
              <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <LockClosedIcon className="h-8 w-8" />
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
                        onClick={() => onNavigate('pet', pet.id)}
                      >
                        <img className="h-16 w-16 rounded-full group-hover:scale-105 transition-transform" src={pet.avatarUrl} alt={pet.name} />
                        <div>
                          <p className="font-bold text-lg group-hover:text-indigo-500">{pet.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed}</p>
                        </div>
                      </div>
                      {areFriends && !isOwner && pet.privacySettings.playdates === 'friends' && (
                          <button 
                              onClick={() => handleOpenPlaydateModal(pet)}
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
                      <LockClosedIcon className="h-6 w-6" />
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
                                  <div key={friendId} className="flex flex-col items-center text-center cursor-pointer" onClick={() => onNavigate('profile', friend.id)}>
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
                      <p className="text-gray-500 dark:text-gray-400 mt-2">{isOwner ? "You haven't" : `${user.name} hasn't`} added any friends yet.</p>
                  </div>
              )
          ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <div className="flex justify-center items-center text-gray-500 dark:text-gray-400">
                      <LockClosedIcon className="h-6 w-6" />
                      <p className="ml-2">This user's friends list is private.</p>
                  </div>
              </div>
          )}
      </div>
    </div>
    {isPlaydateModalOpen && playdateTarget && (
        <RequestPlaydateModal
            currentUser={currentUser}
            targetUser={user}
            targetPet={playdateTarget}
            onClose={() => setIsPlaydateModalOpen(false)}
            onSendRequest={handleSendPlaydate}
        />
    )}
    </>
  );
};

export default UserProfile;