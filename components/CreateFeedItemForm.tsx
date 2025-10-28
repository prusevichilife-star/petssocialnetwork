
import React, { useState } from 'react';
import { User, PetActivity, PetActivityCategory } from '../types';
import PuzzlePieceIcon from './icons/PuzzlePieceIcon';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';


interface CreateFeedItemFormProps {
  currentUser: User;
  onCreatePost: (content: string, petId?: string) => void;
  onCreateActivity: (activityData: Omit<PetActivity, 'id'>, petId: string) => void;
}

const CreateFeedItemForm: React.FC<CreateFeedItemFormProps> = ({ currentUser, onCreatePost, onCreateActivity }) => {
  const [activeTab, setActiveTab] = useState<'post' | 'activity'>('post');
  
  // Post state
  const [postContent, setPostContent] = useState('');

  // Activity state
  const [selectedPetId, setSelectedPetId] = useState(currentUser.pets[0]?.id || '');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityCategory, setActivityCategory] = useState<PetActivityCategory>('Milestone');
  const [activityDescription, setActivityDescription] = useState('');
  const [activityPhotoUrl, setActivityPhotoUrl] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePost(postContent);
    setPostContent('');
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !activityTitle) return;
    
    onCreateActivity({
        title: activityTitle,
        date: new Date(activityDate).toISOString(),
        category: activityCategory,
        description: activityDescription || undefined,
        photoUrl: activityPhotoUrl || undefined,
    }, selectedPetId);

    // Reset form
    setActivityTitle('');
    setActivityDate(new Date().toISOString().split('T')[0]);
    setActivityCategory('Milestone');
    setActivityDescription('');
    setActivityPhotoUrl('');
  };
  
  const TabButton: React.FC<{tabName: 'post' | 'activity', label: string, icon: React.ReactNode}> = ({ tabName, label, icon }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`flex-1 flex items-center justify-center p-3 font-semibold border-b-2 transition-colors ${
            activeTab === tabName 
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
    >
        {icon}
        <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex">
        <TabButton tabName="post" label="Post" icon={<ClipboardDocumentListIcon />} />
        <TabButton tabName="activity" label="Activity" icon={<PuzzlePieceIcon />} />
      </div>
      
      <div className="p-4">
        {activeTab === 'post' ? (
          <div className="flex items-start space-x-4">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-12 w-12 rounded-full" />
            <form onSubmit={handlePostSubmit} className="w-full">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!postContent.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleActivitySubmit} className="space-y-4">
             {currentUser.pets.length > 0 ? (
                <>
                    <div>
                        <label htmlFor="act-pet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Which pet?</label>
                        <select id="act-pet" value={selectedPetId} onChange={e => setSelectedPetId(e.target.value)} className="mt-1 w-full p-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900">
                             {currentUser.pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
                        </select>
                    </div>
                    <input type="text" value={activityTitle} onChange={e => setActivityTitle(e.target.value)} className="w-full p-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" placeholder="Activity Title" required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="act-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input type="date" id="act-date" value={activityDate} onChange={e => setActivityDate(e.target.value)} className="mt-1 w-full p-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" max={new Date().toISOString().split('T')[0]} required />
                        </div>
                        <div>
                            <label htmlFor="act-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select id="act-category" value={activityCategory} onChange={e => setActivityCategory(e.target.value as PetActivityCategory)} className="mt-1 w-full p-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900">
                                <option>Milestone</option>
                                <option>Playtime</option>
                                <option>Adventure</option>
                                <option>Grooming</option>
                            </select>
                        </div>
                    </div>
                    <textarea value={activityDescription} onChange={e => setActivityDescription(e.target.value)} className="w-full p-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" placeholder="Description (optional)" rows={2}></textarea>
                    <input type="text" value={activityPhotoUrl} onChange={e => setActivityPhotoUrl(e.target.value)} className="w-full p-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" placeholder="Photo URL (optional)" />
                    <div className="text-right">
                        <button type="submit" disabled={!activityTitle.trim() || !selectedPetId} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors">Log Activity</button>
                    </div>
                </>
             ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 p-4">You need to add a pet to your profile before you can log an activity.</p>
             )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateFeedItemForm;