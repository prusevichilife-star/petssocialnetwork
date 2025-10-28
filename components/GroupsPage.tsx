
import React from 'react';
import { User, Group } from '../types';
import { CurrentView } from '../App';
import CreateGroupModal from './CreateGroupModal';
import { PlusIcon } from '@heroicons/react/24/solid';

interface GroupsPageProps {
  currentUser: User;
  allGroups: Group[];
  onNavigate: (view: CurrentView, id?: string) => void;
  onCreateGroup: (name: string, description: string, visibility: 'public' | 'private') => void;
}

const GroupCard: React.FC<{group: Group, onNavigate: (view: CurrentView, id: string) => void}> = ({ group, onNavigate }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
      onClick={() => onNavigate('group', group.id)}
    >
      <img src={group.avatarUrl} alt={group.name} className="w-20 h-20 rounded-lg object-cover" />
      <div className="flex-1">
        <p className="font-bold text-lg text-gray-900 dark:text-white">{group.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{group.description}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{group.members.length} member(s)</p>
      </div>
    </div>
)

const GroupsPage: React.FC<GroupsPageProps> = ({ currentUser, allGroups, onNavigate, onCreateGroup }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const myGroups = allGroups.filter(g => g.members.some(m => m.userId === currentUser.id));
  const discoverGroups = allGroups.filter(g => g.visibility === 'public' && !g.members.some(m => m.userId === currentUser.id));

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Groups</h1>
        <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center"
        >
            <PlusIcon className="h-5 w-5 mr-2"/>
            Create Group
        </button>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">My Groups</h2>
        {myGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myGroups.map(group => <GroupCard key={group.id} group={group} onNavigate={onNavigate} />)}
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">You haven't joined any groups yet. Explore some below!</p>
            </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Discover Groups</h2>
         {discoverGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {discoverGroups.map(group => <GroupCard key={group.id} group={group} onNavigate={onNavigate} />)}
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No new public groups to discover right now.</p>
            </div>
        )}
      </section>

      {isCreateModalOpen && (
          <CreateGroupModal 
            onClose={() => setIsCreateModalOpen(false)}
            onCreateGroup={(...args) => {
                onCreateGroup(...args);
                setIsCreateModalOpen(false);
            }}
          />
      )}
    </div>
  );
};

export default GroupsPage;
