
import React from 'react';
import { Group, User } from '../types';

interface GroupViewProps {
  group: Group;
  currentUser: User;
  onLeaveGroup: (groupId: string) => void;
  onJoinGroup: (groupId: string) => void;
  onReturnToList: () => void;
}

const GroupView: React.FC<GroupViewProps> = ({ group, currentUser, onLeaveGroup, onJoinGroup, onReturnToList }) => {
  const isMember = group.members.hasOwnProperty(currentUser.id);
  const isAdmin = isMember && group.members[currentUser.id].role === 'admin';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button onClick={onReturnToList} className="text-indigo-600 hover:underline mb-4">&larr; Back to Groups</button>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <img src={group.avatarUrl} alt={group.name} className="w-24 h-24 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <p className="text-gray-600">{group.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>{group.visibility} Group</span>
              <span className="mx-2">·</span>
              <span>{Object.keys(group.members).length} members</span>
            </div>
          </div>
          <div className="flex-grow flex justify-end">
            {isMember ? (
              <button
                onClick={() => onLeaveGroup(group.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={isAdmin}
              >
                {isAdmin ? 'Admin' : 'Leave Group'}
              </button>
            ) : (
              <button
                onClick={() => onJoinGroup(group.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Join Group
              </button>
            )}
          </div>
        </div>
        {/* Further group content like posts, member list, etc. would go here */}
      </div>
    </div>
  );
};

export default GroupView;
