import React from 'react';
import { User } from '../types';
import { CurrentView } from '../App';
import { HomeIcon, SparklesIcon, ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon, Cog6ToothIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolidIcon, SparklesIcon as SparklesSolidIcon, ChatBubbleOvalLeftEllipsisIcon as ChatSolidIcon, UserCircleIcon as UserSolidIcon, Cog6ToothIcon as CogSolidIcon, UserGroupIcon as UserGroupSolidIcon } from '@heroicons/react/24/solid';

interface SidebarProps {
  currentUser: User;
  currentView: CurrentView;
  onNavigate: (view: CurrentView, id?: string) => void;
}

const NavItem: React.FC<{
    label: string;
    isActive: boolean;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    ActiveIcon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
}> = ({ label, isActive, Icon, ActiveIcon, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 p-3 rounded-full text-xl transition-colors duration-200 ${
                isActive 
                ? 'font-bold text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {isActive ? <ActiveIcon className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
            <span>{label}</span>
        </button>
    </li>
)

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentView, onNavigate }) => {
  return (
    <aside className="hidden lg:block col-span-3 py-8">
        <div className="fixed w-64">
            <nav>
                <ul className="space-y-2">
                   <NavItem 
                        label="Home" 
                        isActive={currentView === 'feed'}
                        Icon={HomeIcon}
                        ActiveIcon={HomeSolidIcon}
                        onClick={() => onNavigate('feed')}
                   />
                   <NavItem 
                        label="Discover" 
                        isActive={currentView === 'discover'}
                        Icon={SparklesIcon}
                        ActiveIcon={SparklesSolidIcon}
                        onClick={() => onNavigate('discover')}
                   />
                    <NavItem 
                        label="Groups" 
                        isActive={currentView === 'groups' || currentView === 'group'}
                        Icon={UserGroupIcon}
                        ActiveIcon={UserGroupSolidIcon}
                        onClick={() => onNavigate('groups')}
                   />
                   <NavItem 
                        label="Messages" 
                        isActive={currentView === 'messages'}
                        Icon={ChatBubbleOvalLeftEllipsisIcon}
                        ActiveIcon={ChatSolidIcon}
                        onClick={() => onNavigate('messages')}
                   />
                   <NavItem 
                        label="Profile" 
                        isActive={currentView === 'profile'}
                        Icon={UserCircleIcon}
                        ActiveIcon={UserSolidIcon}
                        onClick={() => onNavigate('profile', currentUser.id)}
                   />
                   {currentUser.role === 'admin' && (
                       <NavItem 
                            label="Admin" 
                            isActive={currentView === 'admin'}
                            Icon={Cog6ToothIcon}
                            ActiveIcon={CogSolidIcon}
                            onClick={() => onNavigate('admin')}
                       />
                   )}
                </ul>
            </nav>
        </div>
    </aside>
  );
};

export default Sidebar;
