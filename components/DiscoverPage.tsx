import React from 'react';
import { User, Pet, Group } from '../types';
import { CurrentView } from '../App';

interface DiscoverPageProps {
  currentUser: User;
  allUsers: User[];
  allGroups: Group[];
  onNavigate: (view: CurrentView, id: string) => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ currentUser, allUsers, allGroups, onNavigate }) => {

  const suggestedUsers = allUsers
    .filter(u => u.id !== currentUser.id && !currentUser.friends.includes(u.id))
    .sort(() => 0.5 - Math.random()) // Randomize for variety
    .slice(0, 8);

  const suggestedGroups = allGroups
    .filter(g => g.visibility === 'public' && !g.members.some(m => m.userId === currentUser.id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);

  const allPets = allUsers.flatMap(u => u.pets);
  const featuredPets = [...allPets].sort(() => 0.5 - Math.random()).slice(0, 9);
  
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Discover</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Find new pets, friends, and groups in the PetSocial community!</p>
      </div>

       <section>
        <h2 className="text-2xl font-bold mb-4">Suggested Groups</h2>
        {suggestedGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedGroups.map(group => (
              <div 
                key={group.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
                onClick={() => onNavigate('group', group.id)}
              >
                <img src={group.avatarUrl} alt={group.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{group.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{group.members.length} member(s)</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No new public groups to suggest right now!</p>
            </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Suggested Users</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {suggestedUsers.map(user => (
            <div 
              key={user.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
              onClick={() => onNavigate('profile', user.id)}
            >
              <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full mx-auto" />
              <p className="mt-2 font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          ))}
        </div>
        {suggestedUsers.length === 0 && (
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">You've friended everyone available!</p>
            </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Pets</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {featuredPets.map(pet => (
            <div 
              key={pet.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group"
              onClick={() => onNavigate('pet', pet.id)}
            >
              <div className="aspect-w-1 aspect-h-1">
                <img src={pet.avatarUrl} alt={pet.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-900 dark:text-white">{pet.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;
