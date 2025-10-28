
import React from 'react';
import { FilterType } from '../App';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';
import PuzzlePieceIcon from './icons/PuzzlePieceIcon';
import UsersIcon from './icons/UsersIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';

interface FeedFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    const baseClasses = "flex-1 sm:flex-none flex items-center justify-center sm:justify-start px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800";
    const activeClasses = "bg-indigo-600 text-white shadow";
    const inactiveClasses = "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600";
    
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            <div className="h-5 w-5">{icon}</div>
            <span className="ml-2 hidden sm:inline">{label}</span>
        </button>
    );
};

const FeedFilter: React.FC<FeedFilterProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
      <div className="flex items-center justify-between space-x-1 sm:space-x-2">
         <FilterButton label="All" icon={<GlobeAltIcon />} isActive={activeFilter === 'all'} onClick={() => onFilterChange('all')} />
         <FilterButton label="Posts" icon={<ClipboardDocumentListIcon />} isActive={activeFilter === 'posts'} onClick={() => onFilterChange('posts')} />
         <FilterButton label="Activities" icon={<PuzzlePieceIcon />} isActive={activeFilter === 'activities'} onClick={() => onFilterChange('activities')} />
         <FilterButton label="Friends" icon={<UsersIcon />} isActive={activeFilter === 'friends'} onClick={() => onFilterChange('friends')} />
      </div>
    </div>
  );
};

export default FeedFilter;
