import React from 'react';
import { Post, User, Pet } from '../types';
import HeartIcon from './icons/HeartIcon';
import { timeAgo } from '../utils';


interface PostCardProps {
  post: Post;
  allUsers: User[];
  onLike: (postId: string) => void;
  onViewProfile: (user: User) => void;
  onViewPet: (pet: Pet) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, allUsers, onLike, onViewProfile, onViewPet }) => {
  const renderContentWithMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, index) => {
        if (index % 2 === 1) { // This is a username
            const mentionedUser = allUsers.find(u => u.username.toLowerCase() === part.toLowerCase());
            if (mentionedUser) {
                return (
                    <strong
                        key={`${index}-${part}`}
                        className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewProfile(mentionedUser);
                        }}
                    >
                        @{part}
                    </strong>
                );
            }
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div
          className="flex items-center mb-4"
        >
          <img 
            className="h-12 w-12 rounded-full cursor-pointer" 
            src={post.pet?.avatarUrl || post.user.avatarUrl} 
            alt={post.pet?.name || post.user.name} 
            onClick={() => post.pet ? onViewPet(post.pet) : onViewProfile(post.user)}
            />
          <div className="ml-4">
            {post.pet ? (
              <>
                <p 
                    className="font-bold text-gray-900 dark:text-white cursor-pointer hover:underline"
                    onClick={() => onViewPet(post.pet)}
                >
                    {post.pet.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.pet.breed} · with <span className="cursor-pointer hover:underline" onClick={() => onViewProfile(post.user)}>{post.user.name}</span> · {timeAgo(post.date)}
                </p>
              </>
            ) : (
              <div onClick={() => onViewProfile(post.user)} className="cursor-pointer">
                <p className="font-bold text-gray-900 dark:text-white hover:underline">{post.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{post.user.username} · {timeAgo(post.date)}</p>
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{renderContentWithMentions(post.content)}</p>
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200"
        >
          <HeartIcon isLiked={post.isLiked} />
          <span className={`font-semibold ${post.isLiked ? 'text-red-500' : ''}`}>{post.likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
