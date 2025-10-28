
import React from 'react';
import { User, PetActivity, PetActivityCategory } from '../types';
import MentionSuggestions from './MentionSuggestions';
import PhotoIcon from './icons/PhotoIcon';
import SparklesIcon from './icons/SparklesIcon';
import CalendarIcon from './icons/CalendarIcon';
import TagIcon from './icons/TagIcon';
import PencilSquareIcon from './icons/PencilSquareIcon';
import ChatSolidIcon from './icons/ChatSolidIcon';


interface CreateFeedItemFormProps {
  currentUser: User;
  allUsers: User[];
  onCreatePost: (content: string, petId?: string) => void;
  onCreateActivity: (activityData: Omit<PetActivity, 'id'>, petId: string) => void;
}

const CreateFeedItemForm: React.FC<CreateFeedItemFormProps> = ({ currentUser, allUsers, onCreatePost, onCreateActivity }) => {
  const [activeTab, setActiveTab] = React.useState<'post' | 'activity'>('post');
  
  // Post state
  const [postContent, setPostContent] = React.useState('');
  const [mentionQuery, setMentionQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<User[]>([]);
  const [suggestionIndex, setSuggestionIndex] = React.useState(0);

  // Activity state
  const [selectedPetId, setSelectedPetId] = React.useState(currentUser.pets[0]?.id || '');
  const [activityTitle, setActivityTitle] = React.useState('');
  const [activityDate, setActivityDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [activityCategory, setActivityCategory] = React.useState<PetActivityCategory>('Playtime');
  const [activityDescription, setActivityDescription] = React.useState('');
  const [activityPhotoUrl, setActivityPhotoUrl] = React.useState('');

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
    setActivityCategory('Playtime');
    setActivityDescription('');
    setActivityPhotoUrl('');
  };

  const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPostContent(value);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      setMentionQuery(query);
      const filteredUsers = allUsers.filter(u =>
        u.username.toLowerCase().startsWith(query.toLowerCase()) && u.id !== currentUser.id
      ).slice(0, 5);

      if (filteredUsers.length > 0) {
        setSuggestions(filteredUsers);
        setShowSuggestions(true);
        setSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectMention = (user: User) => {
    const textBeforeMention = postContent.substring(0, postContent.lastIndexOf(`@${mentionQuery}`));
    const textAfterMention = postContent.substring(postContent.lastIndexOf(`@${mentionQuery}`) + `@${mentionQuery}`.length);
    
    setPostContent(`${textBeforeMention}@${user.username} ${textAfterMention}`);
    setShowSuggestions(false);
    setMentionQuery('');
  };

  const handlePostKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSuggestionIndex(prev => (prev + 1) % suggestions.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length); }
      else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); handleSelectMention(suggestions[suggestionIndex]); }
      else if (e.key === 'Escape') { setShowSuggestions(false); }
    }
  };
  
  const TabButton: React.FC<{tabName: 'post' | 'activity', label: string, icon: React.ReactNode}> = ({ tabName, label, icon }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`w-full flex items-center justify-center p-3 font-semibold border-b-2 transition-colors ${
            activeTab === tabName 
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
    >
        {icon}
        <span className="ml-2">{label}</span>
    </button>
  );
  
  const InputField: React.FC<{id: string, label:string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, required?: boolean, max?: string, icon: React.ReactNode}> = 
    ({id, label, type="text", value, onChange, placeholder, required, max, icon}) => (
    <div className="relative">
        <label htmlFor={id} className="sr-only">{label}</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
        </div>
        <input 
            id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} max={max}
            className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <TabButton tabName="post" label="New Post" icon={<ChatSolidIcon className="h-5 w-5"/>} />
        <TabButton tabName="activity" label="Log Activity" icon={<SparklesIcon className="h-5 w-5"/>} />
      </div>
      
      <div className="p-4">
        {activeTab === 'post' ? (
          <div className="flex items-start space-x-4">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-11 w-11 rounded-full" />
            <form onSubmit={handlePostSubmit} className="w-full relative">
              <textarea
                value={postContent}
                onChange={handlePostContentChange}
                onKeyDown={handlePostKeyDown}
                placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                className="w-full p-2 border-2 border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-200"
                rows={3}
              />
              {showSuggestions && <MentionSuggestions users={suggestions} onSelect={handleSelectMention} activeIndex={suggestionIndex} />}
              <div className="flex justify-end mt-2">
                <button type="submit" disabled={!postContent.trim()} className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors">
                  Post
                </button>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleActivitySubmit} className="space-y-4">
             {currentUser.pets.length > 0 ? (
                <>
                    <select id="act-pet" value={selectedPetId} onChange={e => setSelectedPetId(e.target.value)} className="w-full p-2 text-base border-gray-200 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 font-semibold focus:ring-indigo-500 focus:border-indigo-500">
                         {currentUser.pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
                    </select>
                    <InputField id="act-title" label="Activity Title" value={activityTitle} onChange={e => setActivityTitle(e.target.value)} placeholder="e.g., Learned a new trick!" required icon={<PencilSquareIcon className="h-5 w-5"/>}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="act-date" label="Date" type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} required max={new Date().toISOString().split('T')[0]} icon={<CalendarIcon className="h-5 w-5"/>} />
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"> <TagIcon className="h-5 w-5"/></div>
                           <select id="act-category" value={activityCategory} onChange={e => setActivityCategory(e.target.value as PetActivityCategory)} className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option>Milestone</option><option>Playtime</option><option>Adventure</option><option>Grooming</option>
                            </select>
                        </div>
                    </div>
                    <textarea value={activityDescription} onChange={e => setActivityDescription(e.target.value)} className="w-full p-2 text-base border-2 border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50" placeholder="Description (optional)" rows={2}></textarea>
                    <InputField id="act-photo" label="Photo URL" value={activityPhotoUrl} onChange={e => setActivityPhotoUrl(e.target.value)} placeholder="Photo URL (optional)" icon={<PhotoIcon className="h-5 w-5"/>} />
                    <div className="text-right">
                        <button type="submit" disabled={!activityTitle.trim() || !selectedPetId} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors">Log Activity</button>
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
