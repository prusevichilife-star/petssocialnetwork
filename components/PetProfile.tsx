

import React, from 'react';
import { Pet, User, Playdate, PetPrivacySettings, Visibility, HealthLogEntry, PetAchievement, HealthLogEntryType, FavoriteItemCategory, FavoriteItem } from '../types';
import PawIcon from './icons/PawIcon';
import CakeIcon from './icons/CakeIcon';
import TagIcon from './icons/TagIcon';
import CalendarIcon from './icons/CalendarIcon';
import PetPrivacySettingsComponent from './PetPrivacySettings';
import LockIcon from './icons/LockIcon';
import UploadIcon from './icons/UploadIcon';
import StethoscopeIcon from './icons/StethoscopeIcon';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import BeakerIcon from './icons/BeakerIcon';
import PillIcon from './icons/PillIcon';
import TrophyIcon from './icons/TrophyIcon';
import SparklesIcon from './icons/SparklesIcon';
import CubeTransparentIcon from './icons/CubeTransparentIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import SunIcon from './icons/SunIcon';
import UserMinusIcon from './icons/UserMinusIcon';

interface PetProfileProps {
  pet: Pet;
  currentUser: User;
  allUsers: { [key: string]: User };
  allPlaydates: Playdate[];
  onReturn: () => void;
  onViewPet: (pet: Pet) => void;
  onViewProfile?: (user: User) => void;
  onUpdatePetPrivacySettings: (petId: string, section: keyof PetPrivacySettings, visibility: Visibility | 'private' | 'friends') => void;
  onAddPetPhoto: (petId: string, photoUrl: string) => void;
  onAddHealthLogEntry: (petId: string, newEntry: Omit<HealthLogEntry, 'id'>) => void;
  onAddPetAchievement: (petId: string, newAchievement: Omit<PetAchievement, 'id'>) => void;
  onAddFavoriteItem: (petId: string, newItem: Omit<FavoriteItem, 'id'>) => void;
  onRemovePetFriend: (petId: string, friendId: string) => void;
}

const calculateAge = (birthdate: string): string => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? `${age} years old` : 'Less than a year old';
};

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <div className="text-indigo-500 dark:text-indigo-300 mb-2">{icon}</div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const PetProfile: React.FC<PetProfileProps> = ({ pet, currentUser, allUsers, allPlaydates, onReturn, onViewPet, onViewProfile, onUpdatePetPrivacySettings, onAddPetPhoto, onAddHealthLogEntry, onAddPetAchievement, onAddFavoriteItem, onRemovePetFriend }) => {
  const age = calculateAge(pet.birthdate);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [showAchievementForm, setShowAchievementForm] = React.useState(false);
  const [newAchievementTitle, setNewAchievementTitle] = React.useState('');
  const [newAchievementDate, setNewAchievementDate] = React.useState(new Date().toISOString().split('T')[0]);

  const [showHealthLogForm, setShowHealthLogForm] = React.useState(false);
  const [newHealthLogType, setNewHealthLogType] = React.useState<HealthLogEntryType>('Vet Visit');
  const [newHealthLogDate, setNewHealthLogDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [newHealthLogNotes, setNewHealthLogNotes] = React.useState('');
  
  const [showFavoriteForm, setShowFavoriteForm] = React.useState(false);
  const [newFavoriteName, setNewFavoriteName] = React.useState('');
  const [newFavoriteCategory, setNewFavoriteCategory] = React.useState<FavoriteItemCategory>('Toy');

  const owner = Object.values(allUsers).find(user => user.pets.some(p => p.id === pet.id));
  const isOwner = owner?.id === currentUser.id;
  const areFriends = owner?.friends.includes(currentUser.id) ?? false;

  const canViewProfile = () => {
      if (isOwner) return true;
      if (pet.privacySettings.profile === 'public') return true;
      if (pet.privacySettings.profile === 'friends' && areFriends) return true;
      return false;
  };

  const findPetById = (petId: string): Pet | undefined => {
    for (const user of Object.values(allUsers)) {
        const foundPet = user.pets.find(p => p.id === petId);
        if (foundPet) return foundPet;
    }
    return undefined;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onAddPetPhoto(pet.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAchievementTitle.trim()) {
      onAddPetAchievement(pet.id, {
        title: newAchievementTitle.trim(),
        date: newAchievementDate,
        icon: 'trophy',
      });
      setNewAchievementTitle('');
      setNewAchievementDate(new Date().toISOString().split('T')[0]);
      setShowAchievementForm(false);
    }
  };

  const handleAddHealthLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHealthLogNotes.trim()) {
      onAddHealthLogEntry(pet.id, {
        type: newHealthLogType,
        date: newHealthLogDate,
        notes: newHealthLogNotes.trim(),
      });
      setNewHealthLogType('Vet Visit');
      setNewHealthLogDate(new Date().toISOString().split('T')[0]);
      setNewHealthLogNotes('');
      setShowHealthLogForm(false);
    }
  };

  const handleAddFavoriteItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFavoriteName.trim()) {
      onAddFavoriteItem(pet.id, {
        name: newFavoriteName.trim(),
        category: newFavoriteCategory,
      });
      setNewFavoriteName('');
      setNewFavoriteCategory('Toy');
      setShowFavoriteForm(false);
    }
  };

  const healthLogIcons: Record<HealthLogEntryType, React.ReactNode> = {
    'Vet Visit': <BuildingOfficeIcon />,
    'Vaccination': <BeakerIcon />,
    'Medication': <PillIcon />,
  };
  
  const favoriteIcons: Record<FavoriteItemCategory, React.ReactNode> = {
    'Toy': <CubeTransparentIcon />,
    'Food': <ShoppingBagIcon />,
    'Activity': <SunIcon />,
  };

  const favoriteItemsByCategory = (pet.favoriteItems || []).reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<FavoriteItemCategory, FavoriteItem[]>);
  
  const playPals = pet.friends.map(findPetById).filter((p): p is Pet => p !== undefined);
  
  const upcomingPlaydates = allPlaydates.filter(pd => 
    (pd.fromPetId === pet.id || pd.toPetId === pet.id) && 
    pd.status === 'accepted' &&
    new Date(pd.date) > new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  if (!canViewProfile()) {
      return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button
                onClick={onReturn}
                className="mb-6 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                &larr; Back
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center flex flex-col items-center justify-center">
                <LockIcon />
                <h2 className="mt-4 text-2xl font-bold">This Pet's Profile is Private</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">The owner of this pet has restricted access to their profile.</p>
            </div>
        </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={onReturn}
        className="mb-6 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        &larr; Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={pet.avatarUrl} alt={`Photo of ${pet.name}`} />
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{pet.name}</h1>
            {owner && onViewProfile && (
                <p 
                    className="mt-1 text-md text-gray-500 dark:text-gray-400">
                    with <span onClick={() => onViewProfile(owner)} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">{owner.name}</span>
                </p>
            )}
            <p className="mt-2 text-gray-600 dark:text-gray-400">{pet.breed}</p>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4">About {pet.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <InfoPill icon={<PawIcon />} label="Type" value={pet.type} />
                    <InfoPill icon={<TagIcon />} label="Breed" value={pet.breed} />
                    <InfoPill icon={<CakeIcon />} label="Age" value={age} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{pet.bio}</p>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center"><SparklesIcon /> <span className="ml-2">Favorite Things</span></h2>
                        {isOwner && (
                            <button 
                                onClick={() => setShowFavoriteForm(!showFavoriteForm)}
                                className="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                            >
                                {showFavoriteForm ? 'Cancel' : 'Add Favorite'}
                            </button>
                        )}
                    </div>
                    
                    {isOwner && showFavoriteForm && (
                        <form onSubmit={handleAddFavoriteItemSubmit} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fav-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input type="text" id="fav-name" value={newFavoriteName} onChange={e => setNewFavoriteName(e.target.value)} className="mt-1 block w-full p-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900" placeholder="e.g., Squeaky Tennis Ball" required />
                                </div>
                                <div>
                                    <label htmlFor="fav-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                    <select id="fav-category" value={newFavoriteCategory} onChange={e => setNewFavoriteCategory(e.target.value as FavoriteItemCategory)} className="mt-1 block w-full p-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900">
                                        <option>Toy</option>
                                        <option>Food</option>
                                        <option>Activity</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700">Save Favorite</button>
                            </div>
                        </form>
                    )}

                    {(pet.favoriteItems && pet.favoriteItems.length > 0) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(Object.keys(favoriteItemsByCategory) as FavoriteItemCategory[]).map(category => (
                                <div key={category} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                    <h3 className="font-bold flex items-center mb-2 text-gray-800 dark:text-gray-200">
                                        {favoriteIcons[category]}
                                        <span className="ml-2">{category}s</span>
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                                        {favoriteItemsByCategory[category].map(item => <li key={item.id}>{item.name}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No favorite items listed yet.</p>
                    )}
                </div>

                 <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Achievements</h2>
                        {isOwner && (
                            <button 
                                onClick={() => setShowAchievementForm(!showAchievementForm)}
                                className="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                            >
                                {showAchievementForm ? 'Cancel' : 'Add Achievement'}
                            </button>
                        )}
                    </div>

                    {isOwner && showAchievementForm && (
                        <form onSubmit={handleAddAchievementSubmit} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="ach-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                    <input
                                        type="text"
                                        id="ach-title"
                                        value={newAchievementTitle}
                                        onChange={(e) => setNewAchievementTitle(e.target.value)}
                                        className="mt-1 block w-full p-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900"
                                        placeholder="e.g., Won 'Best in Show'"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="ach-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                                    <input
                                        type="date"
                                        id="ach-date"
                                        value={newAchievementDate}
                                        onChange={(e) => setNewAchievementDate(e.target.value)}
                                        className="mt-1 block w-full p-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900"
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="text-right mt-4">
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    )}

                    {(pet.achievements && pet.achievements.length > 0) ? (
                        <ul className="space-y-3">
                            {pet.achievements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(ach => (
                                <li key={ach.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <TrophyIcon />
                                    <div className="ml-4">
                                        <p className="font-semibold text-gray-900 dark:text-white">{ach.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No achievements logged yet.</p>
                    )}
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Play Pals ({playPals.length})</h2>
                 {playPals.length > 0 ? (
                    <div className="space-y-3">
                        {playPals.map(pal => (
                            <div key={pal.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <div onClick={() => onViewPet(pal)} className="flex items-center space-x-3 cursor-pointer">
                                    <img className="h-12 w-12 rounded-full" src={pal.avatarUrl} alt={pal.name} />
                                    <div>
                                        <p className="font-semibold group-hover:text-indigo-500">{pal.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{pal.breed}</p>
                                    </div>
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => onRemovePetFriend(pet.id, pal.id)}
                                        className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Friend"
                                    >
                                        <UserMinusIcon />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No play pals yet!</p>
                )}
            </div>
        </div>
        
        {isOwner && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center"><StethoscopeIcon /><span className="ml-2">Health Log (Private)</span></h2>
                    <button 
                        onClick={() => setShowHealthLogForm(!showHealthLogForm)}
                        className="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                    >
                        {showHealthLogForm ? 'Cancel' : 'Add New Entry'}
                    </button>
                </div>
                {showHealthLogForm && (
                    <form onSubmit={handleAddHealthLogSubmit} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="hl-type" className="block text-sm font-medium">Type</label>
                                <select id="hl-type" value={newHealthLogType} onChange={e => setNewHealthLogType(e.target.value as HealthLogEntryType)} className="mt-1 block w-full p-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900">
                                    <option>Vet Visit</option>
                                    <option>Vaccination</option>
                                    <option>Medication</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="hl-date" className="block text-sm font-medium">Date</label>
                                <input type="date" id="hl-date" value={newHealthLogDate} onChange={e => setNewHealthLogDate(e.target.value)} className="mt-1 block w-full p-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900" max={new Date().toISOString().split('T')[0]} required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="hl-notes" className="block text-sm font-medium">Notes</label>
                            <textarea id="hl-notes" value={newHealthLogNotes} onChange={e => setNewHealthLogNotes(e.target.value)} rows={3} className="mt-1 block w-full p-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900" placeholder="e.g., Annual booster shots." required></textarea>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700">Save Entry</button>
                        </div>
                    </form>
                )}
                {(pet.healthLog && pet.healthLog.length > 0) ? (
                     <ul className="space-y-3">
                        {pet.healthLog.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                            <li key={entry.id} className="flex p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="text-indigo-500 dark:text-indigo-300">{healthLogIcons[entry.type]}</div>
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-gray-900 dark:text-white">{entry.type}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(entry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{entry.notes}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-center py-4 text-gray-500 dark:text-gray-400">No health records logged yet.</p>
                )}
            </div>
        )}

        {isOwner && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <PetPrivacySettingsComponent 
                    settings={pet.privacySettings}
                    onUpdate={(section, visibility) => onUpdatePetPrivacySettings(pet.id, section, visibility)}
                />
            </div>
        )}

        {upcomingPlaydates.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 flex items-center"><CalendarIcon /> <span className="ml-2">Upcoming Playdates</span></h2>
                <ul className="space-y-3">
                   {upcomingPlaydates.map(pd => {
                       const otherPetId = pd.fromPetId === pet.id ? pd.toPetId : pd.fromPetId;
                       const otherPet = findPetById(otherPetId);
                       if (!otherPet) return null;
                       return (
                           <li key={pd.id} className="p-3 bg-indigo-50 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                               <div className="flex items-center space-x-3">
                                   <div className="flex -space-x-4">
                                       <img className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800" src={pet.avatarUrl} alt={pet.name} />
                                       <img className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800" src={otherPet.avatarUrl} alt={otherPet.name} />
                                   </div>
                                   <div>
                                       <p className="font-semibold">Playdate with {otherPet.name}</p>
                                       <p className="text-sm text-gray-500 dark:text-gray-400">{pd.location}</p>
                                   </div>
                               </div>
                               <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">{new Date(pd.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                           </li>
                       )
                   })}
                </ul>
            </div>
        )}

        {pet.photos && pet.photos.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Photo Gallery</h2>
                    {isOwner && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                onClick={handleUploadClick}
                                className="px-3 py-1.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors flex items-center"
                            >
                                <UploadIcon />
                                <span className="ml-2">Upload Photo</span>
                            </button>
                        </>
                    )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pet.photos.map((photo, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1">
                            <img 
                                src={photo} 
                                alt={`${pet.name} photo ${index + 1}`} 
                                className="object-cover w-full h-full rounded-lg shadow-md hover:scale-105 transition-transform duration-200" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default PetProfile;
