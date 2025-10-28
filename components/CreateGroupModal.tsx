
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreateGroup: (name: string, description: string, visibility: 'public' | 'private') => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreateGroup }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [visibility, setVisibility] = React.useState<'public' | 'private'>('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateGroup(name.trim(), description.trim(), visibility);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create a New Group</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="h-5 w-5"/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Name</label>
            <input
              type="text"
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
            <fieldset className="mt-2">
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    <div className="flex items-center">
                        <input id="public" name="visibility" type="radio" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                        <label htmlFor="public" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Public</label>
                    </div>
                    <div className="flex items-center">
                        <input id="private" name="visibility" type="radio" checked={visibility === 'private'} onChange={() => setVisibility('private')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                        <label htmlFor="private" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Private</label>
                    </div>
                </div>
            </fieldset>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:opacity-50" disabled={!name.trim()}>Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
