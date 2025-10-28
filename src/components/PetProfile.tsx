
import React from 'react';
import { Pet, User, Playdate, PetPrivacySettings, Visibility, HealthLogEntry, HealthLogEntryType, FavoriteItemCategory, FavoriteItem, PetAchievement } from '../types';
import { CurrentView } from '../App';
import PetPrivacySettingsComponent from './PetPrivacySettings';
import { LockClosedIcon, ArrowUpOnSquareIcon, PlusIcon, CalendarDaysIcon, UserMinusIcon } from '@heroicons/react/24/solid';
import { TagIcon, CakeIcon, BeakerIcon, BuildingOfficeIcon, PillIcon, TrophyIcon, SparklesIcon, CubeTransparentIcon, ShoppingBagIcon, SunIcon, ClipboardDocumentIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface PetProfileProps {
  pet: Pet;
  currentUser: User;
  allUsersMap: { [key: string]: User };
  allPlaydates: Playdate[];
  onNavigate: (view: CurrentView, id?: string) => void;
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
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? `${age} years old` : 'Less than a year old';
};

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
        <div className="text-indigo-500 dark:text-indigo-300 mb-2">{icon}</div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const Section: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode, action?: React.ReactNode}> = ({title, icon, children, action}) => (
    <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">{icon} <span className="ml-2">{title}</span></h2>
            {action}
        </div>
        {children}
    </div>
);

const PetProfile: React.FC<PetProfileProps> = ({ pet, currentUser, allUsersMap, allPlaydates, onNavigate, onUpdatePetPrivacySettings, onAddPetPhoto, onAddHealthLogEntry, onAddPetAchievement, onAddFavoriteItem, onRemovePetFriend }) => {
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

  const owner = (Object.values(allUsersMap) as User[]).find((user: User) => user.pets.some(p => p.id === pet.id));
  const isOwner = owner?.id === currentUser.id;
  const areFriends = owner?.friends.includes(currentUser.id) ?? false;

  const canViewProfile = isOwner || pet.privacySettings.profile === 'public' || (pet.privacySettings.profile === 'friends' && areFriends);

  const findPetById = (petId: string): Pet | undefined => {
    for (const user of (Object.values(allUsersMap) as User[])) {
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

  const handleAddAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPetAchievement(pet.id, { title: newAchievementTitle.trim(), date: newAchievementDate, icon: 'trophy' });
    setNewAchievementTitle(''); setShowAchievementForm(false);
  };

  const handleAddHealthLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHealthLogEntry(pet.id, { type: newHealthLogType, date: newHealthLogDate, notes: newHealthLogNotes.trim() });
    setNewHealthLogNotes(''); setShowHealthLogForm(false);
  };
  
  const handleAddFavoriteItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFavoriteItem(pet.id, { name: newFavoriteName.trim(), category: newFavoriteCategory });
    setNewFavoriteName(''); setShowFavoriteForm(false);
  };
  
  const healthLogIcons: Record<HealthLogEntryType, React.ReactNode> = { 'Vet Visit': <BuildingOfficeIcon className="h-6 w-6"/>, 'Vaccination': <BeakerIcon className="h-6 w-6"/>, 'Medication': <PillIcon className="h-6 w-6"/> };
  const favoriteIcons: Record<FavoriteItemCategory, React.ReactNode> = { 'Toy': <CubeTransparentIcon className="h-5 w-5"/>, 'Food': <ShoppingBagIcon className="h-5 w-5"/>, 'Activity': <SunIcon className="h-5 w-5"/> };
  
  const favoriteItemsByCategory = (pet.favoriteItems || []).reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item];
    return acc;
  }, {} as Record<FavoriteItemCategory, FavoriteItem[]>);
  
  const playPals = pet.friends.map(findPetById).filter((p): p is Pet => p !== undefined);
  const upcomingPlaydates = allPlaydates.filter(pd => (pd.fromPetId === pet.id || pd.toPetId === pet.id) && pd.status === 'accepted' && new Date(pd.date) > new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!canViewProfile) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center flex flex-col items-center justify-center">
            <LockClosedIcon className="h-10 w-10 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold">This Pet's Profile is Private</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">The owner has restricted access to this profile.</p>
        </div>
      )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <img className="h-48 w-full object-cover md:w-48" src={pet.avatarUrl} alt={`Photo of ${pet.name}`} />
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{pet.name}</h1>
            {owner && <p className="mt-1 text-md text-gray-500 dark:text-gray-400">with <span onClick={() => onNavigate('profile', owner.id)} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">{owner.name}</span></p>}
            <p className="mt-2 text-gray-600 dark:text-gray-400">{pet.breed}</p>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold mb-4">About {pet.name}</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <InfoPill icon={<ClipboardDocumentIcon className="h-8 w-8" />} label="Type" value={pet.type} />
                    <InfoPill icon={<TagIcon className="h-8 w-8" />} label="Breed" value={pet.breed} />
                    <InfoPill icon={<CakeIcon className="h-8 w-8" />} label="Age" value={age} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{pet.bio}</p>
                 <Section title="Favorite Things" icon={<SparklesIcon className="h-6 w-6 text-yellow-500"/>} action={isOwner && <button onClick={() => setShowFavoriteForm(!showFavoriteForm)} className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-800 font-semibold rounded-full hover:bg-indigo-200">{showFavoriteForm ? 'Cancel' : 'Add'}</button>}>
                   {isOwner && showFavoriteForm && (<form onSubmit={handleAddFavoriteItemSubmit} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 space-y-4"> {/* ... form ... */} </form>)}
                    {(pet.favoriteItems && pet.favoriteItems.length > 0) ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(Object.keys(favoriteItemsByCategory) as FavoriteItemCategory[]).map(category => (<div key={category} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"><h3 className="font-bold flex items-center mb-2">{favoriteIcons[category]}<span className="ml-2">{category}s</span></h3><ul className="list-disc list-inside space-y-1">{favoriteItemsByCategory[category].map(item => <li key={item.id}>{item.name}</li>)}</ul></div>))}
                    </div>) : <p className="text-sm text-gray-500 dark:text-gray-400">No favorite items listed.</p>}
                </Section>
            </div>
            <div>
                <Section title={`Play Pals (${playPals.length})`} icon={<UserGroupIcon className="h-6 w-6"/>}>
                    {playPals.length > 0 ? <div className="space-y-3">{playPals.map(pal => <div key={pal.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"><div onClick={() => onNavigate('pet', pal.id)} className="flex items-center space-x-3 cursor-pointer"><img className="h-12 w-12 rounded-full" src={pal.avatarUrl} alt={pal.name} /><div><p className="font-semibold group-hover:text-indigo-500">{pal.name}</p><p className="text-sm text-gray-500 dark:text-gray-400">{pal.breed}</p></div></div>{isOwner && <button onClick={() => onRemovePetFriend(pet.id, pal.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 opacity-0 group-hover:opacity-100" title="Remove Friend"><UserMinusIcon className="h-5 w-5"/></button>}</div>)}</div> : <p className="text-sm text-gray-500 dark:text-gray-400">No play pals yet!</p>}
                </Section>
                <Section title="Achievements" icon={<TrophyIcon className="h-6 w-6 text-yellow-500"/>} action={isOwner && <button onClick={() => setShowAchievementForm(!showAchievementForm)} className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-800 font-semibold rounded-full hover:bg-indigo-200">{showAchievementForm ? 'Cancel' : 'Add'}</button>}>
                     {isOwner && showAchievementForm && (<form onSubmit={handleAddAchievementSubmit} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4"> {/* ... form ... */} </form>)}
                    {(pet.achievements && pet.achievements.length > 0) ? <ul className="space-y-3">{pet.achievements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(ach => <li key={ach.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"><TrophyIcon className="h-8 w-8"/>...</li>)}</ul> : <p className="text-sm text-gray-500">No achievements yet.</p>}
                </Section>
            </div>
        </div>
        
        {isOwner && (<div className="p-6 border-t border-gray-200 dark:border-gray-700"><PetPrivacySettingsComponent settings={pet.privacySettings} onUpdate={(section, visibility) => onUpdatePetPrivacySettings(pet.id, section, visibility)}/></div>)}

        {upcomingPlaydates.length > 0 && (<div className="p-6 border-t border-gray-200 dark:border-gray-700"><Section title="Upcoming Playdates" icon={<CalendarDaysIcon className="h-6 w-6"/>}>...</Section></div>)}
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">Photo Gallery</h2>{isOwner && <><input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*"/><button onClick={() => fileInputRef.current?.click()} className="..."><ArrowUpOnSquareIcon className="h-5 w-5"/><span className="ml-2">Upload</span></button></>}</div>
            {(pet.photos && pet.photos.length > 0) ? <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{pet.photos.map((photo, index) => <div key={index}><img src={photo} alt={`${pet.name} ${index + 1}`} className="object-cover w-full h-full rounded-lg"/></div>)}</div> : <p>No photos yet.</p>}
        </div>
      </div>

       {isOwner && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Section title="Health Log (Private)" icon={<BeakerIcon className="h-6 w-6"/>} action={<button onClick={() => setShowHealthLogForm(!showHealthLogForm)} className="...">{showHealthLogForm ? 'Cancel' : 'Add Entry'}</button>}>
                 {showHealthLogForm && (<form onSubmit={handleAddHealthLogSubmit} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg my-4 space-y-4"> {/* ... form ... */} </form>)}
                {(pet.healthLog && pet.healthLog.length > 0) ? <ul className="space-y-3">{pet.healthLog.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => <li key={entry.id} className="flex p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"><div className="text-indigo-500">{healthLogIcons[entry.type]}</div>...</li>)}</ul> : <p>No health records logged.</p>}
            </Section>
        </div>
      )}
    </div>
  );
};

export default PetProfile;
