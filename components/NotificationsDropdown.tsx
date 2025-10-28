import React from 'react';
import { User, FriendRequest, Playdate, Pet } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import GiftIcon from './icons/GiftIcon';

interface NotificationsDropdownProps {
  user: User;
  allUsers: { [key: string]: User };
  friendRequests: FriendRequest[];
  playdates: Playdate[];
  onRespondToFriendRequest: (requestId: string, accepted: boolean) => void;
  onRespondToPlaydateRequest: (playdateId: string, accepted: boolean) => void;
}

const getUpcomingBirthdays = (pets: Pet[]): Pet[] => {
    if (!pets || pets.length === 0) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingWindow = new Date(today);
    upcomingWindow.setDate(today.getDate() + 7);

    return pets.filter(pet => {
        const birthDate = new Date(pet.birthdate);
        const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        const birthdayNextYear = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
        return (birthdayThisYear >= today && birthdayThisYear <= upcomingWindow) || (birthdayNextYear >= today && birthdayNextYear <= upcomingWindow);
    });
};

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ user, allUsers, friendRequests, playdates, onRespondToFriendRequest, onRespondToPlaydateRequest }) => {
    const upcomingBirthdays = getUpcomingBirthdays(user.pets);

    const findPetById = (petId: string): Pet | undefined => {
        for (const u of Object.values(allUsers)) {
            const foundPet = u.pets.find(p => p.id === petId);
            if (foundPet) return foundPet;
        }
        return undefined;
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {friendRequests.length === 0 && playdates.length === 0 && upcomingBirthdays.length === 0 && (
                    <li className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications.</li>
                )}

                {friendRequests.map(req => {
                    const fromUser = allUsers[req.fromUserId];
                    if (!fromUser) return null;
                    return (
                        <li key={req.id} className="p-3">
                            <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full object-cover" src={fromUser.avatarUrl} alt={fromUser.name} />
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        <span className="font-semibold">{fromUser.name}</span> sent you a friend request.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end space-x-2">
                                <button onClick={() => onRespondToFriendRequest(req.id, true)} className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full flex items-center"><CheckIcon /> <span className="ml-1">Accept</span></button>
                                <button onClick={() => onRespondToFriendRequest(req.id, false)} className="px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold rounded-full flex items-center"><XIcon /> <span className="ml-1">Decline</span></button>
                            </div>
                        </li>
                    )
                })}
                {playdates.map(pd => {
                    const fromUser = allUsers[pd.fromUserId];
                    const fromPet = findPetById(pd.fromPetId);
                    const toPet = findPetById(pd.toPetId);
                    if (!fromUser || !fromPet || !toPet) return null;
                    return (
                         <li key={pd.id} className="p-3">
                            <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full object-cover" src={fromPet.avatarUrl} alt={fromPet.name} />
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        <span className="font-semibold">{fromUser.name}</span> invited <span className="font-semibold">{fromPet.name}</span> to a playdate with <span className="font-semibold">{toPet.name}</span>.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end space-x-2">
                                <button onClick={() => onRespondToPlaydateRequest(pd.id, true)} className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full flex items-center"><CheckIcon /> <span className="ml-1">Accept</span></button>
                                <button onClick={() => onRespondToPlaydateRequest(pd.id, false)} className="px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold rounded-full flex items-center"><XIcon /> <span className="ml-1">Decline</span></button>
                            </div>
                        </li>
                    )
                })}

                {upcomingBirthdays.length > 0 && (
                    <>
                        <li className="p-2 bg-gray-50 dark:bg-gray-700">
                           <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Upcoming Birthdays</h4>
                        </li>
                        {upcomingBirthdays.map(pet => (
                            <li key={pet.id} className="p-3 flex items-center">
                                <GiftIcon />
                                <img className="ml-2 h-10 w-10 rounded-full object-cover" src={pet.avatarUrl} alt={pet.name} />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pet.name}'s birthday</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        on {new Date(pet.birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </>
                )}
            </ul>
        </div>
    );
};

export default NotificationsDropdown;
