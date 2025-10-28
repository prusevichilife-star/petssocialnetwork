
import React from 'react';
import { Group } from '../types';

interface GroupCardProps {
  group: Group;
  onViewGroup: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onViewGroup }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
      <img src={group.avatarUrl} alt={group.name} className="w-16 h-16 rounded-full" />
      <div className="flex-grow">
        <h3 className="text-lg font-bold">{group.name}</h3>
        <p className="text-sm text-gray-600">{group.description}</p>
        <div className="text-xs text-gray-500 mt-1">
          <span>{Object.keys(group.members).length} members</span>
          <span className="mx-2">·</span>
          <span>{group.visibility}</span>
        </div>
      </div>
      <button
        onClick={() => onViewGroup(group)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        View
      </button>
    </div>
  );
};

export default GroupCard;
