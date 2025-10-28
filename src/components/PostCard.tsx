import React from 'react';
import { Pet, User } from '../types';
import { EnrichedPost, CurrentView } from '../App';
import { timeAgo } from '../utils';
import { HeartIcon, ChatBubbleOvalLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';


interface PostCardProps {
  post: EnrichedPost;
  onLike: (postId: string) => void;
  onNavigate: (view: CurrentView, id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onNavigate }) => {
  const renderContentWithMentions = (content: string) => {
    // This is a simplified version. A real app would query users.
    const mentionRegex = /@(\w+)/g;
    return content.split(mentionRegex).map((part, index) => {
        if (index % 2 === 1) { // This is a username
            return (
                <strong
                    key={`${index}-${part}`}
                    className="text-indigo-500 dark:text-indigo-400 cursor-pointer hover:underline"
                >
                    @{part}
                </strong>
            );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img 
            className="h-12 w-12 rounded-full cursor-pointer" 
            src={post.pet?.avatarUrl || post.user.avatarUrl} 
            alt={post.pet?.name || post.user.name} 
            onClick={() => post.pet ? onNavigate('pet', post.pet.id) : onNavigate('profile', post.user.id)}
            />
          <div className="ml-4">
            {post.pet ? (
              <>
                <p 
                    className="font-bold text-gray-900 dark:text-white cursor-pointer hover:underline"
                    onClick={() => onNavigate('pet', post.pet.id)}
                >
                    {post.pet.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.pet.breed} · with <span className="cursor-pointer hover:underline" onClick={() => onNavigate('profile', post.user.id)}>{post.user.name}</span>
                </p>
              </>
            ) : (
              <div onClick={() => onNavigate('profile', post.user.id)} className="cursor-pointer">
                <p className="font-bold text-gray-900 dark:text-white hover:underline">{post.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{post.user.username}</p>
              </div>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(post.date)}</p>
          </div>
        </div>
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{renderContentWithMentions(post.content)}</p>
      </div>
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex space-x-6">
            <button
            onClick={() => onLike(post.id)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 group"
            >
            {post.isLiked ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6" />}
            <span className={`font-semibold group-hover:text-red-500 dark:group-hover:text-red-400 ${post.isLiked ? 'text-red-500' : ''}`}>{post.likeCount}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 group">
                <ChatBubbleOvalLeftIcon className="h-6 w-6" />
                <span className="font-semibold group-hover:text-indigo-500 dark:group-hover:text-indigo-400">Comment</span>
            </button>
             <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200 group">
                <ArrowUturnRightIcon className="h-6 w-6" />
                <span className="font-semibold group-hover:text-green-500 dark:group-hover:text-green-400">Share</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;