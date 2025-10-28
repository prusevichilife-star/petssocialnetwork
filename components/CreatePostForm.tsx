

import React from 'react';
import { User } from '../types';

interface CreatePostFormProps {
  onCreatePost: (content: string) => void;
  user: User;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onCreatePost, user }) => {
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePost(content);
    setContent('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-start space-x-4">
        <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
