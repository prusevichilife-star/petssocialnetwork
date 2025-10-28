

import React from 'react';
import { User, FriendRequest, Playdate, Message } from '../types';
import NotificationsDropdown from './NotificationsDropdown';
import { BellIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CurrentView } from '../App';


interface HeaderProps {
  user: User;
  allUsers: { [key: string]: User };
  messages: Message[];
  allFriendRequests: FriendRequest[];
  allPlaydates: Playdate[];
  onLogout: () => void;
  onRespondToFriendRequest: (requestId: string, accepted: boolean) => void;
  onRespondToPlaydateRequest: (playdateId: string, accepted: boolean) => void;
  onNavigate: (view: CurrentView, id?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    user, 
    allUsers,
    messages, 
    allFriendRequests, 
    allPlaydates, 
    onLogout, 
    onRespondToFriendRequest, 
    onRespondToPlaydateRequest,
    onNavigate
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  const notificationCount = allFriendRequests.length + allPlaydates.length;
  const unreadMessagesCount = messages.filter(m => m.toUserId === user.id && !m.read).length;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('feed')}>
            <svg className="h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.6074 8.22152C13.0125 7.84093 13.0332 7.20815 12.6526 6.80306C12.272 6.39797 11.6393 6.37728 11.2342 6.75787L11.2336 6.75841C10.8285 7.13899 10.8078 7.77178 11.1884 8.17687C11.569 8.58196 12.2018 8.60264 12.6068 8.22205L12.6074 8.22152Z" />
              <path d="M9.34961 9.1932C9.80145 8.75628 9.82725 8.05282 9.39033 7.5997C8.95341 7.14658 8.24995 7.12078 7.79683 7.5577L7.79629 7.55823C7.34317 7.99515 7.31737 8.69861 7.75429 9.15173C8.19121 9.60485 8.89467 9.63065 9.34779 9.19373L9.34961 9.1932Z" />
              <path d="M17.411 9.15545C17.8592 8.70605 17.882 8.00164 17.4326 7.55342C16.9832 7.1052 16.2788 7.128 15.8306 7.5774L15.8294 7.57857C15.3812 8.02797 15.3584 8.73238 15.8078 9.1806C16.2572 9.62882 16.9616 9.60605 17.4098 9.15665L17.411 9.15545Z" />
              <path d="M12.0002 21.3498C12.7061 21.3498 13.3852 21.1343 13.9312 20.7342C15.2631 19.7839 17.2285 17.6583 17.3481 15.1511C17.4203 13.5651 16.6343 12.1003 15.2803 11.2407C13.8833 10.352 12.0002 10.5 12.0002 10.5C12.0002 10.5 10.1171 10.352 8.72009 11.2407C7.36609 12.1003 6.58008 13.5651 6.65228 15.1511C6.77188 17.6583 8.73729 19.7839 10.0692 20.7342C10.6152 21.1343 11.2942 21.3498 12.0002 21.3498Z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">PetSocial</span>
          </div>
           <div className="flex-1 max-w-xs ml-12">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search PetSocial"
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-transparent rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>
          <div className="flex items-center space-x-2">
             <div className="relative">
                 <button
                    onClick={() => onNavigate('messages')}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Open messages"
                    title="Messages"
                 >
                    <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-800" />
                    )}
                </button>
            </div>
            <div className="relative" ref={notificationsRef}>
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Show notifications"
                >
                    <BellIcon className="h-6 w-6" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 block text-xs flex items-center justify-center h-5 w-5 transform translate-x-1/3 -translate-y-1/3 rounded-full bg-red-500 text-white ring-2 ring-white dark:ring-gray-800">
                        {notificationCount}
                      </span>
                    )}
                </button>
                {showNotifications && (
                    <NotificationsDropdown 
                      user={user}
                      allUsers={allUsers}
                      friendRequests={allFriendRequests}
                      playdates={allPlaydates}
                      onRespondToFriendRequest={onRespondToFriendRequest}
                      onRespondToPlaydateRequest={onRespondToPlaydateRequest}
                    />
                )}
            </div>
            
            <div className="pl-2 flex items-center space-x-2">
                 <button onClick={onLogout} className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Logout</button>
                 <img
                    className="h-9 w-9 rounded-full cursor-pointer"
                    src={user.avatarUrl}
                    alt={user.name}
                    onClick={() => onNavigate('profile', user.id)}
                />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
