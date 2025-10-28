
import React, { useState } from 'react';
import { GroupVisibility } from '../types';

interface CreateGroupFormProps {
  onCreateGroup: (name: string, description: string, visibility: GroupVisibility) => void;
  onCancel: () => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onCreateGroup, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<GroupVisibility>('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onCreateGroup(name, description, visibility);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="group-description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          </div>
          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700">Visibility</span>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <span className="ml-3 text-sm text-gray-700">
                  <strong className="block">Public</strong>
                  Anyone can see the group, its members, and their posts.
                </span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <span className="ml-3 text-sm text-gray-700">
                  <strong className="block">Private</strong>
                  Only members can see who's in the group and what they post.
                </span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="visibility" value="secret" checked={visibility === 'secret'} onChange={() => setVisibility('secret')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <span className="ml-3 text-sm text-gray-700">
                  <strong className="block">Secret</strong>
                  Only members can find the group and see what they post.
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupForm;
