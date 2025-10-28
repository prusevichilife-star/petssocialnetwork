import React from 'react';
import { Post, User } from '../types';
import HeartIcon from './icons/HeartIcon';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onViewProfile: (user: User) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onViewProfile }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div
          className="flex items-center mb-4 cursor-pointer"
          onClick={() => onViewProfile(post.user)}
        >
          <img className="h-12 w-12 rounded-full" src={post.pet?.avatarUrl || post.user.avatarUrl} alt={post.pet?.name || post.user.name} />
          <div className="ml-4">
            {post.pet ? (
              <>
                <p className="font-bold text-gray-900 dark:text-white">{post.pet.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {post.pet.breed} · with {post.user.name} · {post.timestamp}
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-gray-900 dark:text-white">{post.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{post.user.username} · {post.timestamp}</p>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.content}</p>
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