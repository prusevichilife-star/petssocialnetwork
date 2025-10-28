

import React from 'react';
import { User, Message } from '../types';
import { CurrentView } from '../App';
import { formatMessageTime } from '../utils';
import { XMarkIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

interface MessagingViewProps {
    currentUser: User;
    allUsers: { [key: string]: User };
    messages: Message[];
    onSendMessage: (toUserId: string, content: string) => void;
    activeConversationUserId: string | null;
    setActiveConversationUserId: (userId: string | null) => void;
    onNavigate: (view: CurrentView, id?: string) => void;
}

type ConversationSummary = { user: User, lastMessage: Message, unreadCount: number };

const MessagingView: React.FC<MessagingViewProps> = ({ 
    currentUser, 
    allUsers, 
    messages, 
    onSendMessage,
    activeConversationUserId,
    setActiveConversationUserId,
    onNavigate,
}) => {
    const [newMessage, setNewMessage] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const conversations = messages.reduce((acc, msg) => {
        const otherUserId = msg.fromUserId === currentUser.id ? msg.toUserId : msg.fromUserId;
        if (allUsers[otherUserId]) {
            if (!acc[otherUserId]) {
                acc[otherUserId] = {
                    user: allUsers[otherUserId],
                    lastMessage: msg,
                    unreadCount: 0,
                };
            }
            if (new Date(msg.timestamp) > new Date(acc[otherUserId].lastMessage.timestamp)) {
                acc[otherUserId].lastMessage = msg;
            }
            if (msg.toUserId === currentUser.id && !msg.read) {
                acc[otherUserId].unreadCount++;
            }
        }
        return acc;
    }, {} as { [key: string]: ConversationSummary });

    const sortedConversations = (Object.values(conversations) as ConversationSummary[]).sort((a, b) => 
        new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );

    React.useEffect(() => {
        if (!activeConversationUserId && sortedConversations.length > 0) {
            setActiveConversationUserId(sortedConversations[0].user.id);
        }
    }, [activeConversationUserId, sortedConversations, setActiveConversationUserId]);
    
    const activeMessages = messages.filter(msg =>
        (msg.fromUserId === currentUser.id && msg.toUserId === activeConversationUserId) ||
        (msg.fromUserId === activeConversationUserId && msg.toUserId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && activeConversationUserId) {
            onSendMessage(activeConversationUserId, newMessage.trim());
            setNewMessage('');
        }
    };

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages]);
    
    const handleUserClick = (user: User) => {
        onNavigate('profile', user.id);
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full h-[75vh] flex flex-col">
            <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">Messages</h2>
            </header>
            <div className="flex-grow flex overflow-hidden">
                <aside className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <ul>
                        {sortedConversations.map(({ user, lastMessage, unreadCount }) => (
                            <li key={user.id}>
                                <button 
                                    onClick={() => setActiveConversationUserId(user.id)}
                                    className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${activeConversationUserId === user.id ? 'bg-indigo-50 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                                >
                                    <div className="relative">
                                        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
                                        {unreadCount > 0 && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-800" />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-semibold truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{formatMessageTime(lastMessage.timestamp)}</p>
                                        </div>
                                        <p className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {lastMessage.fromUserId === currentUser.id && "You: "} {lastMessage.content}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="w-2/3 flex flex-col">
                    {activeConversationUserId && allUsers[activeConversationUserId] ? (
                        <>
                            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                                <img src={allUsers[activeConversationUserId].avatarUrl} alt={allUsers[activeConversationUserId].name} className="w-10 h-10 rounded-full" />
                                <p 
                                    onClick={() => handleUserClick(allUsers[activeConversationUserId])}
                                    className="font-bold cursor-pointer hover:underline"
                                >
                                    {allUsers[activeConversationUserId].name}
                                </p>
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                                {activeMessages.map(msg => (
                                    <div key={msg.id} className={`flex items-end gap-2 ${msg.fromUserId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                        {msg.fromUserId !== currentUser.id && <img src={allUsers[msg.fromUserId].avatarUrl} className="w-6 h-6 rounded-full" />}
                                        <p className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.fromUserId === currentUser.id ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-600 rounded-bl-lg'}`}>
                                            {msg.content}
                                        </p>
                                        {msg.fromUserId === currentUser.id && <img src={currentUser.avatarUrl} className="w-6 h-6 rounded-full" />}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                />
                                <button type="submit" className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                </button>
                            </form>
                        </>
                    ) : (
                            <div className="flex-grow flex flex-col justify-center items-center text-gray-500 dark:text-gray-400">
                            <ChatBubbleLeftRightIcon className="h-12 w-12" />
                            <p className="mt-2">Select a conversation to start chatting.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MessagingView;
