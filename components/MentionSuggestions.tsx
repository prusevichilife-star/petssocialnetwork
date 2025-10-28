import React from 'react';
import { User } from '../types';

interface MentionSuggestionsProps {
    users: User[];
    onSelect: (user: User) => void;
    activeIndex: number;
}

const MentionSuggestions: React.FC<MentionSuggestionsProps> = ({ users, onSelect, activeIndex }) => {
    return (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            <ul>
                {users.map((user, index) => (
                    <li
                        key={user.id}
                        onClick={() => onSelect(user)}
                        onMouseEnter={() => {}} // Could be used to update activeIndex on hover
                        className={`p-3 cursor-pointer flex items-center space-x-3 ${
                            index === activeIndex ? 'bg-indigo-100 dark:bg-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-600/50'
                        }`}
                    >
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div>
                           <span className="font-semibold text-gray-900 dark:text-white">{user.name}</span>
                           <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">@{user.username}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MentionSuggestions;
