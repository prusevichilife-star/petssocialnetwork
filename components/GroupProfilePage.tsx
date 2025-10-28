
import React from 'react';
import { Group, User, Post } from '../types';
import { CurrentView, EnrichedPost } from '../App';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';
import { GlobeAltIcon, LockClosedIcon, UserPlusIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

interface GroupProfilePageProps {
  group: Group;
  currentUser: User;
  allUsersMap: { [key: string]: User };
  allPosts: Post[];
  onNavigate: (view: CurrentView, id?: string) => void;
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onCreatePost: (content: string, petId?: string, groupId?: string) => void;
  onLikeFeedItem: (itemId: string) => void;
}

const GroupProfilePage: React.FC<GroupProfilePageProps> = ({ group, currentUser, allUsersMap, allPosts, onNavigate, onJoinGroup, onLeaveGroup, onCreatePost, onLikeFeedItem }) => {
    const [activeTab, setActiveTab] = React.useState<'posts' | 'members'>('posts');

    const isMember = group.members.some(m => m.userId === currentUser.id);

    const groupPosts: EnrichedPost[] = React.useMemo(() => {
        return allPosts
            .filter(p => p.groupId === group.id)
            .map(post => {
                const user = allUsersMap[post.userId];
                const pet = user?.pets.find(p => p.id === post.petId);
                return {
                    ...post,
                    user,
                    pet,
                    isLiked: currentUser.likedFeedItems.includes(post.id)
                };
            })
            .filter((p): p is EnrichedPost => !!p.user)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allPosts, group.id, allUsersMap, currentUser.likedFeedItems]);

    return (
        <div className="space-y-8">
            {/* Group Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                    <img src={group.avatarUrl} alt={group.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover" />
                    <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-grow">
                        <h1 className="text-3xl font-bold">{group.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {group.visibility === 'public' ? <GlobeAltIcon className="h-4 w-4 mr-1.5" /> : <LockClosedIcon className="h-4 w-4 mr-1.5" />}
                            <span>{group.visibility === 'public' ? 'Public' : 'Private'} Group</span>
                            <span className="mx-2">·</span>
                            <span>{group.members.length} member(s)</span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{group.description}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                        {isMember ? (
                            <button 
                                onClick={() => onLeaveGroup(group.id)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 inline-flex items-center"
                            >
                               <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" /> Leave Group
                            </button>
                        ) : group.visibility === 'public' ? (
                            <button 
                                onClick={() => onJoinGroup(group.id)}
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 inline-flex items-center"
                            >
                                <UserPlusIcon className="h-5 w-5 mr-2" /> Join Group
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('posts')} className={`${activeTab === 'posts' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Posts</button>
                    <button onClick={() => setActiveTab('members')} className={`${activeTab === 'members' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Members</button>
                </nav>
            </div>
            
            {/* Content */}
            <div>
                {activeTab === 'posts' && (
                    <div className="space-y-6">
                        {isMember ? (
                            <CreatePostForm user={currentUser} onCreatePost={(content) => onCreatePost(content, undefined, group.id)} />
                        ) : (
                             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                                <p className="text-gray-500 dark:text-gray-400">Join the group to post and comment.</p>
                            </div>
                        )}
                        {groupPosts.map(post => <PostCard key={post.id} post={post} onLike={onLikeFeedItem} onNavigate={onNavigate} />)}
                    </div>
                )}
                {activeTab === 'members' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {group.members.map(member => {
                                const user = allUsersMap[member.userId];
                                if (!user) return null;
                                return (
                                    <div key={user.id} className="flex items-center space-x-4">
                                        <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
                                        <div>
                                            <p onClick={() => onNavigate('profile', user.id)} className="font-semibold cursor-pointer hover:underline">{user.name}</p>
                                            {member.role === 'admin' && <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full">Admin</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default GroupProfilePage;
