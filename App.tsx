
import React, { useState, useCallback } from 'react';
import { User, Pet, Role, UserStatus, Visibility, PrivacySettings, FriendRequest, Playdate, PetPrivacySettings, HealthLogEntry, PetAchievement, FavoriteItem, FeedItem, Post, ActivityFeedItem, Message } from './types';
import Header from './components/Header';
import CreateFeedItemForm from './components/CreateFeedItemForm';
import PostCard from './components/PostCard';
import PetActivityCard from './components/PetActivityCard';
import Login from './components/Login';
import Mfa from './components/Mfa';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import PetProfile from './components/PetProfile';
import RequestPlaydateModal from './components/RequestPlaydateModal';
import DiscoverPage from './components/DiscoverPage';
import MessagingView from './components/MessagingView';
import FeedFilter from './components/FeedFilter';

const initialPets: { [key: string]: Pet } = {
  'pet-1': { id: 'pet-1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', avatarUrl: 'https://picsum.photos/seed/buddy/200/200', birthdate: '2018-05-12', bio: 'Loves fetch and long walks.', photos: ['https://picsum.photos/seed/buddy-1/400/300'], friends: ['pet-2', 'pet-5'], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-2': { id: 'pet-2', name: 'Lucy', type: 'Cat', breed: 'Siamese', avatarUrl: 'https://picsum.photos/seed/lucy/200/200', birthdate: '2020-09-20', bio: 'A very vocal and curious cat.', photos: ['https://picsum.photos/seed/lucy-1/400/300'], friends: ['pet-1'], privacySettings: { profile: 'friends', playdates: 'friends' } },
  'pet-3': { id: 'pet-3', name: 'Max', type: 'Dog', breed: 'German Shepherd', avatarUrl: 'https://picsum.photos/seed/max/200/200', birthdate: '2017-02-01', bio: 'Loyal and protective.', photos: ['https://picsum.photos/seed/max-1/400/300'], friends: [], privacySettings: { profile: 'friends', playdates: 'private' } },
  'pet-4': { id: 'pet-4', name: 'Chloe', type: 'Cat', breed: 'Persian', avatarUrl: 'https://picsum.photos/seed/chloe/200/200', birthdate: '2021-11-30', bio: 'Loves being pampered.', photos: ['https://picsum.photos/seed/chloe-1/400/300'], friends: ['pet-7'], privacySettings: { profile: 'private', playdates: 'private' } },
  'pet-5': { id: 'pet-5', name: 'Rocky', type: 'Dog', breed: 'Boxer', avatarUrl: 'https://picsum.photos/seed/rocky/200/200', birthdate: '2019-03-22', bio: 'Energetic and playful.', photos: ['https://picsum.photos/seed/rocky-1/400/300'], friends: ['pet-1'], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-6': { id: 'pet-6', name: 'Milo', type: 'Cat', breed: 'Tabby', avatarUrl: 'https://picsum.photos/seed/milo/200/200', birthdate: '2022-01-15', bio: 'A friendly tabby who loves cuddles.', photos: ['https://picsum.photos/seed/milo-1/400/300'], friends: [], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-7': { id: 'pet-7', name: 'Daisy', type: 'Dog', breed: 'Beagle', avatarUrl: 'https://picsum.photos/seed/daisy/200/200', birthdate: '2020-06-10', bio: 'Follows her nose everywhere.', photos: ['https://picsum.photos/seed/daisy-1/400/300'], friends: ['pet-4', 'pet-8'], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-8': { id: 'pet-8', name: 'Simba', type: 'Cat', breed: 'Maine Coon', avatarUrl: 'https://picsum.photos/seed/simba/200/200', birthdate: '2018-11-05', bio: 'A gentle giant.', photos: ['https://picsum.photos/seed/simba-1/400/300'], friends: ['pet-7'], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-9': { id: 'pet-9', name: 'Sadie', type: 'Dog', breed: 'Poodle', avatarUrl: 'https://picsum.photos/seed/sadie/200/200', birthdate: '2021-08-25', bio: 'Loves showing off her new haircuts.', photos: ['https://picsum.photos/seed/sadie-1/400/300'], friends: [], privacySettings: { profile: 'friends', playdates: 'friends' } },
  'pet-10': { id: 'pet-10', name: 'Oreo', type: 'Cat', breed: 'Domestic Shorthair', avatarUrl: 'https://picsum.photos/seed/oreo/200/200', birthdate: '2019-05-01', bio: 'Classic black and white cat attitude.', photos: ['https://picsum.photos/seed/oreo-1/400/300'], friends: [], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-11': { id: 'pet-11', name: 'Zeus', type: 'Dog', breed: 'Great Dane', avatarUrl: 'https://picsum.photos/seed/zeus/200/200', birthdate: '2020-02-14', bio: 'Thinks he is a lap dog.', photos: ['https://picsum.photos/seed/zeus-1/400/300'], friends: [], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-12': { id: 'pet-12', name: 'Nala', type: 'Cat', breed: 'Bengal', avatarUrl: 'https://picsum.photos/seed/nala/200/200', birthdate: '2022-03-10', bio: 'Loves to climb and explore.', photos: ['https://picsum.photos/seed/nala-1/400/300'], friends: [], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-13': { id: 'pet-13', name: 'Lola', type: 'Dog', breed: 'Chihuahua', avatarUrl: 'https://picsum.photos/seed/lola/200/200', birthdate: '2017-10-01', bio: 'Small but mighty.', photos: ['https://picsum.photos/seed/lola-1/400/300'], friends: [], privacySettings: { profile: 'friends', playdates: 'private' } },
  'pet-14': { id: 'pet-14', name: 'Misty', type: 'Cat', breed: 'Russian Blue', avatarUrl: 'https://picsum.photos/seed/misty/200/200', birthdate: '2021-04-05', bio: 'Shy and sweet.', photos: ['https://picsum.photos/seed/misty-1/400/300'], friends: [], privacySettings: { profile: 'public', playdates: 'friends' } },
  'pet-15': { id: 'pet-15', name: 'Cooper', type: 'Dog', breed: 'Australian Shepherd', avatarUrl: 'https://picsum.photos/seed/cooper/200/200', birthdate: '2019-09-12', bio: 'Loves to herd anything that moves.', photos: ['https://picsum.photos/seed/cooper-1/400/300'], friends: [], privacySettings: { profile: 'public', playdates: 'friends' } },
};

const initialUsersData: { [key: string]: Omit<User, 'id'> } = {
  'user-1': { name: 'Alice Johnson', username: 'alicej', avatarUrl: 'https://picsum.photos/seed/alice/100/100', pets: [initialPets['pet-1']], role: 'admin', status: 'active', friends: ['user-2', 'user-4'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-2': { name: 'Bob Williams', username: 'bobw', avatarUrl: 'https://picsum.photos/seed/bob/100/100', pets: [initialPets['pet-2'], initialPets['pet-3']], role: 'moderator', status: 'active', friends: ['user-1'], privacySettings: { profileBasics: 'public', pets: 'friends', activity: 'public', friends: 'friends' }, incomingFriendRequests: ['req-1'], outgoingFriendRequests: [] },
  'user-3': { name: 'Charlie Brown', username: 'charlieb', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', pets: [initialPets['pet-4']], role: 'user', status: 'active', friends: ['user-5'], privacySettings: { profileBasics: 'friends', pets: 'friends', activity: 'private', friends: 'private' }, incomingFriendRequests: [], outgoingFriendRequests: ['req-1'] },
  'user-4': { name: 'Diana Prince', username: 'dianap', avatarUrl: 'https://picsum.photos/seed/diana/100/100', pets: [initialPets['pet-5'], initialPets['pet-6']], role: 'user', status: 'active', friends: ['user-1', 'user-6'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-5': { name: 'Ethan Hunt', username: 'ethanh', avatarUrl: 'https://picsum.photos/seed/ethan/100/100', pets: [initialPets['pet-7']], role: 'user', status: 'active', friends: ['user-3', 'user-7'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-6': { name: 'Fiona Glenanne', username: 'fionag', avatarUrl: 'https://picsum.photos/seed/fiona/100/100', pets: [initialPets['pet-8']], role: 'user', status: 'active', friends: ['user-4', 'user-8'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'friends', friends: 'friends' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-7': { name: 'George Costanza', username: 'georgec', avatarUrl: 'https://picsum.photos/seed/george/100/100', pets: [initialPets['pet-9'], initialPets['pet-10']], role: 'user', status: 'active', friends: ['user-5', 'user-9'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-8': { name: 'Hannah Montana', username: 'hannahm', avatarUrl: 'https://picsum.photos/seed/hannah/100/100', pets: [], role: 'user', status: 'suspended', friends: ['user-6'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-9': { name: 'Indiana Jones', username: 'indianaj', avatarUrl: 'https://picsum.photos/seed/indiana/100/100', pets: [initialPets['pet-11']], role: 'user', status: 'active', friends: ['user-7'], privacySettings: { profileBasics: 'public', pets: 'friends', activity: 'friends', friends: 'friends' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-10': { name: 'Jack Sparrow', username: 'jack_sparrow', avatarUrl: 'https://picsum.photos/seed/jack/100/100', pets: [], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-11': { name: 'Kim Possible', username: 'kimp', avatarUrl: 'https://picsum.photos/seed/kim/100/100', pets: [initialPets['pet-12']], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-12': { name: 'Liz Lemon', username: 'lizl', avatarUrl: 'https://picsum.photos/seed/liz/100/100', pets: [initialPets['pet-13'], initialPets['pet-14']], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'friends', pets: 'friends', activity: 'friends', friends: 'friends' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-13': { name: 'Michael Scott', username: 'michaels', avatarUrl: 'https://picsum.photos/seed/michael/100/100', pets: [initialPets['pet-15']], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-14': { name: 'Ned Flanders', username: 'nedf', avatarUrl: 'https://picsum.photos/seed/ned/100/100', pets: [], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-15': { name: 'Olivia Benson', username: 'oliviab', avatarUrl: 'https://picsum.photos/seed/olivia/100/100', pets: [], role: 'moderator', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
};

const initialUsers: { [key: string]: User } = Object.fromEntries(
  Object.entries(initialUsersData).map(([id, userData]) => [id, { id, ...userData }])
);

const initialPostsData: (Omit<Post, 'id' | 'user' | 'pet'> & { userId: string, petId?: string })[] = [
  { type: 'post', userId: 'user-1', petId: 'pet-1', content: 'Buddy enjoying the sunshine at the park today! ☀️🐶', date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), likeCount: 77, isLiked: false },
  { type: 'post', userId: 'user-2', petId: 'pet-2', content: 'Lucy loves her new scratching post! 😻', date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), likeCount: 42, isLiked: false },
  { type: 'post', userId: 'user-3', petId: 'pet-4', content: 'Chloe is being majestic as usual.', date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), likeCount: 128, isLiked: true },
  { type: 'post', userId: 'user-4', petId: 'pet-5', content: 'Rocky has so much energy today!', date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), likeCount: 55, isLiked: false },
  { type: 'post', userId: 'user-5', petId: 'pet-7', content: 'Daisy found a new smell she is very interested in.', date: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), likeCount: 30, isLiked: false },
  { type: 'post', userId: 'user-6', petId: 'pet-8', content: 'Simba is just a big fluffy pillow.', date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), likeCount: 90, isLiked: true },
  { type: 'post', userId: 'user-7', petId: 'pet-9', content: 'Sadie got a fresh trim! Looking fabulous.', date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), likeCount: 112, isLiked: false },
  { type: 'post', userId: 'user-9', petId: 'pet-11', content: 'Zeus tried to sit on my lap. Send help.', date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), likeCount: 250, isLiked: true },
  { type: 'post', userId: 'user-13', petId: 'pet-15', content: 'Cooper is trying to herd the Roomba.', date: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), likeCount: 180, isLiked: false },
];

const initialActivitiesData: (Omit<ActivityFeedItem, 'id' | 'user' | 'pet'> & { userId: string, petId: string })[] = [
    { type: 'activity', userId: 'user-1', petId: 'pet-1', title: 'First Swim at the Lake', date: '2024-07-20T10:00:00.000Z', description: 'He was a bit scared at first but then loved it!', category: 'Adventure', photoUrl: 'https://picsum.photos/seed/buddy-swim/400/300', likeCount: 55, isLiked: true },
    { type: 'activity', userId: 'user-1', petId: 'pet-1', title: 'Learned to Shake Hands', date: '2024-06-05T15:30:00.000Z', description: 'After many treats, he finally got it!', category: 'Milestone', likeCount: 89, isLiked: false },
    { type: 'activity', userId: 'user-4', petId: 'pet-6', title: 'Conquered the Bookshelf', date: '2024-07-19T12:00:00.000Z', description: 'Milo reached the top shelf for the first time!', category: 'Milestone', photoUrl: 'https://picsum.photos/seed/milo-climb/400/300', likeCount: 63, isLiked: false },
    { type: 'activity', userId: 'user-7', petId: 'pet-10', title: 'Puzzle Toy Time', date: '2024-07-18T18:00:00.000Z', description: 'Oreo solved his new puzzle toy in record time.', category: 'Playtime', likeCount: 45, isLiked: true },
    { type: 'activity', userId: 'user-11', petId: 'pet-12', title: 'First Vet Visit', date: '2024-05-15T09:30:00.000Z', description: 'Nala was so brave!', category: 'Milestone', photoUrl: 'https://picsum.photos/seed/nala-vet/400/300', likeCount: 78, isLiked: false },
];

const initialFriendRequests: { [key: string]: FriendRequest } = {
    'req-1': { id: 'req-1', fromUserId: 'user-3', toUserId: 'user-2', status: 'pending' },
};

const initialPlaydates: { [key: string]: Playdate } = {
    'pd-1': { id: 'pd-1', fromPetId: 'pet-1', fromUserId: 'user-1', toPetId: 'pet-4', toUserId: 'user-3', status: 'pending', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Virtual Park' }
};

const initialMessages: Message[] = [
    { id: 'msg-1', fromUserId: 'user-2', toUserId: 'user-1', content: 'Hey Alice! How is Buddy doing?', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), read: false },
    { id: 'msg-2', fromUserId: 'user-1', toUserId: 'user-2', content: "He's great! We went to the park today.", timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), read: true },
    { id: 'msg-3', fromUserId: 'user-4', toUserId: 'user-1', content: 'Wanna schedule a playdate for Rocky and Buddy?', timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), read: false },
];

const allPosts: Post[] = initialPostsData.map((p, i) => ({
    ...p,
    id: `post-${i+1}`,
    user: initialUsers[p.userId],
    pet: p.petId ? initialPets[p.petId] : undefined,
}));

const allActivities: ActivityFeedItem[] = initialActivitiesData.map((a, i) => ({
    ...a,
    id: `act-${i+1}`,
    user: initialUsers[a.userId],
    pet: initialPets[a.petId],
}));

const combinedFeed: FeedItem[] = [...allPosts, ...allActivities];
combinedFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


type AuthState = 'loggedOut' | 'needsMfa' | 'loggedIn' | 'adminDashboard';
type CurrentView = 'feed' | 'discover';
type LoginResult = 'success' | 'notFound' | 'suspended';
export type FilterType = 'all' | 'posts' | 'activities' | 'friends';


const App: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(combinedFeed);
  const [users, setUsers] = useState<{ [key: string]: User }>(initialUsers);
  const [friendRequests, setFriendRequests] = useState<{ [key: string]: FriendRequest }>(initialFriendRequests);
  const [playdates, setPlaydates] = useState<{ [key: string]: Playdate }>(initialPlaydates);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  
  const [authState, setAuthState] = useState<AuthState>('loggedIn');
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers['user-1']);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);
  const [currentView, setCurrentView] = useState<CurrentView>('feed');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');


  const [isPlaydateModalOpen, setIsPlaydateModalOpen] = useState(false);
  const [playdateTarget, setPlaydateTarget] = useState<{user: User, pet: Pet} | null>(null);

  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);

  const handleLogin = (username: string): LoginResult => {
    const user = Object.values(users).find(u => u.username === username);
    if (user) {
      if (user.status === 'suspended') {
        return 'suspended';
      }
      setCurrentUser(user);
      setAuthState('needsMfa');
      return 'success';
    }
    return 'notFound';
  };

  const handleMfaSubmit = (trustDevice: boolean) => {
    if (currentUser) {
      if (trustDevice) {
        localStorage.setItem('trustedUser', currentUser.username);
      }
      setAuthState('loggedIn');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('trustedUser');
    setCurrentUser(null);
    setViewingProfile(null);
    setViewingPet(null);
    setCurrentView('feed');
    setAuthState('loggedOut');
  };

  const handleCreatePost = useCallback((content: string, petId?: string) => {
    if (!content.trim() || !currentUser) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      type: 'post',
      user: currentUser,
      content,
      date: new Date().toISOString(),
      likeCount: 0,
      isLiked: false,
      pet: petId ? currentUser.pets.find(p => p.id === petId) : (currentUser.pets.length === 1 ? currentUser.pets[0] : undefined),
    };

    setFeedItems(prevFeed => [newPost, ...prevFeed]);
  }, [currentUser]);
  
  const handleCreateActivity = useCallback((activityData: Omit<ActivityFeedItem, 'id'|'type'|'user'|'pet'|'likeCount'|'isLiked'>, petId: string) => {
    if (!currentUser) return;
    const pet = currentUser.pets.find(p => p.id === petId);
    if (!pet) return;

    const newActivity: ActivityFeedItem = {
        ...activityData,
        id: `act-${Date.now()}`,
        type: 'activity',
        user: currentUser,
        pet: pet,
        likeCount: 0,
        isLiked: false,
    };
    
    setFeedItems(prevFeed => [newActivity, ...prevFeed].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [currentUser]);

  const handleLikeFeedItem = useCallback((itemId: string) => {
    setFeedItems(prevFeed =>
      prevFeed.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            isLiked: !item.isLiked,
            likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
          };
        }
        return item;
      })
    );
  }, []);
  
  const handleViewProfile = (user: User) => {
    setViewingPet(null);
    setCurrentView('feed');
    setViewingProfile(user);
  };
  
  const handleReturnToFeed = () => {
    setViewingPet(null);
    setViewingProfile(null);
    setCurrentView('feed');
  };

  const handleViewPet = (pet: Pet) => {
    setViewingProfile(null);
    setCurrentView('feed');
    setViewingPet(pet);
  };

  const handleNavigateToDashboard = () => {
    setViewingProfile(null);
    setViewingPet(null);
    setCurrentView('feed');
    setAuthState('adminDashboard');
  };
  
  const handleReturnToFeedFromDashboard = () => {
    setViewingProfile(null);
    setViewingPet(null);
    setCurrentView('feed');
    setAuthState('loggedIn');
  };
  
  const handleNavigateToDiscover = () => {
    setViewingProfile(null);
    setViewingPet(null);
    setCurrentView('discover');
  };

  const handleUpdateUserRole = (userId: string, role: Role) => {
    setUsers(prevUsers => {
        const updatedUsers = { ...prevUsers, [userId]: { ...prevUsers[userId], role } };
        
        setFeedItems(prevFeed => prevFeed.map(item => 
          item.user.id === userId ? { ...item, user: updatedUsers[userId] } : item
        ));

        return updatedUsers;
    });
  };

  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prevUsers => {
        const updatedUsers = { ...prevUsers, [userId]: { ...prevUsers[userId], status } };
        
        setFeedItems(prevFeed => prevFeed.map(item => 
          item.user.id === userId ? { ...item, user: updatedUsers[userId] } : item
        ));
        
        return updatedUsers;
    });
  };
  
  const handleUpdatePrivacySettings = (userId: string, section: keyof PrivacySettings, visibility: Visibility) => {
    const userToUpdate = users[userId];
    if (userToUpdate) {
      const updatedUser = {
        ...userToUpdate,
        privacySettings: {
          ...userToUpdate.privacySettings,
          [section]: visibility,
        }
      };
      const updatedUsers = { ...users, [userId]: updatedUser };
      setUsers(updatedUsers);
      
      if(viewingProfile?.id === userId) setViewingProfile(updatedUser);
      if(currentUser?.id === userId) setCurrentUser(updatedUser);
      
      setFeedItems(prevFeed => prevFeed.map(item => 
        item.user.id === userId ? { ...item, user: updatedUser } : item
      ));
    }
  };

  const handleUpdatePetPrivacySettings = (petId: string, section: keyof PetPrivacySettings, visibility: Visibility | 'private' | 'friends') => {
      setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        let ownerId: string | null = null;
        
        for (const userId in newUsers) {
            const user = newUsers[userId];
            const petIndex = user.pets.findIndex(p => p.id === petId);
            if (petIndex !== -1) {
                ownerId = userId;
                const updatedPet = {
                    ...user.pets[petIndex],
                    privacySettings: {
                        ...user.pets[petIndex].privacySettings,
                        [section]: visibility,
                    },
                };
                user.pets[petIndex] = updatedPet;
                if (viewingPet?.id === petId) setViewingPet(updatedPet);
                break;
            }
        }

        if (ownerId) {
          if (currentUser?.id === ownerId) setCurrentUser(newUsers[ownerId]);
          if (viewingProfile?.id === ownerId) setViewingProfile(newUsers[ownerId]);
        }

        return newUsers;
      });
  };

  const handleAddPetPhoto = (petId: string, photoUrl: string) => {
    setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        let ownerId: string | null = null;

        for (const userId in newUsers) {
            const user = newUsers[userId];
            const petIndex = user.pets.findIndex(p => p.id === petId);
            if (petIndex !== -1) {
                ownerId = userId;
                const updatedPet = {
                    ...user.pets[petIndex],
                    photos: [...user.pets[petIndex].photos, photoUrl],
                };
                user.pets[petIndex] = updatedPet;
                if (viewingPet?.id === petId) setViewingPet(updatedPet);
                break;
            }
        }
        
        if (ownerId) {
          if (currentUser?.id === ownerId) setCurrentUser(newUsers[ownerId]);
          if (viewingProfile?.id === ownerId) setViewingProfile(newUsers[ownerId]);
        }

        return newUsers;
    });
  };

  const handleAddHealthLogEntry = (petId: string, newEntry: Omit<HealthLogEntry, 'id'>) => {
    setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        let ownerId: string | null = null;
        for (const userId in newUsers) {
            const user = newUsers[userId];
            const petIndex = user.pets.findIndex(p => p.id === petId);
            if (petIndex !== -1) {
                ownerId = userId;
                const updatedPet = {
                    ...user.pets[petIndex],
                    healthLog: [
                        ...(user.pets[petIndex].healthLog || []),
                        { ...newEntry, id: `hl-${Date.now()}` },
                    ],
                };
                user.pets[petIndex] = updatedPet;
                if (viewingPet?.id === petId) setViewingPet(updatedPet);
                break;
            }
        }
        
        if (ownerId) {
          if (currentUser?.id === ownerId) setCurrentUser(newUsers[ownerId]);
          if (viewingProfile?.id === ownerId) setViewingProfile(newUsers[ownerId]);
        }

        return newUsers;
    });
  };

  const handleAddPetAchievement = (petId: string, newAchievement: Omit<PetAchievement, 'id'>) => {
    setUsers(prevUsers => {
      const newUsers = { ...prevUsers };
      let ownerId: string | null = null;
      for (const userId in newUsers) {
        const user = newUsers[userId];
        const petIndex = user.pets.findIndex(p => p.id === petId);
        if (petIndex !== -1) {
          ownerId = userId;
          const updatedPet = {
            ...user.pets[petIndex],
            achievements: [
              ...(user.pets[petIndex].achievements || []),
              { ...newAchievement, id: `ach-${Date.now()}` },
            ],
          };
          user.pets[petIndex] = updatedPet;
          if (viewingPet?.id === petId) setViewingPet(updatedPet);
          break;
        }
      }

      if (ownerId) {
        if (currentUser?.id === ownerId) setCurrentUser(newUsers[ownerId]);
        if (viewingProfile?.id === ownerId) setViewingProfile(newUsers[ownerId]);
      }

      return newUsers;
    });
  };
  
  const handleAddFavoriteItem = (petId: string, newItem: Omit<FavoriteItem, 'id'>) => {
    setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        let ownerId: string | null = null;
        for (const userId in newUsers) {
            const user = newUsers[userId];
            const petIndex = user.pets.findIndex(p => p.id === petId);
            if (petIndex !== -1) {
                ownerId = userId;
                const updatedPet = {
                    ...user.pets[petIndex],
                    favoriteItems: [
                        ...(user.pets[petIndex].favoriteItems || []),
                        { ...newItem, id: `fav-${Date.now()}` },
                    ],
                };
                user.pets[petIndex] = updatedPet;
                if (viewingPet?.id === petId) setViewingPet(updatedPet);
                break;
            }
        }
        
        if (ownerId) {
          if (currentUser?.id === ownerId) setCurrentUser(newUsers[ownerId]);
          if (viewingProfile?.id === ownerId) setViewingProfile(newUsers[ownerId]);
        }

        return newUsers;
    });
  };

  const handleSendFriendRequest = (toUserId: string) => {
    if (!currentUser) return;
    const fromUserId = currentUser.id;
    if (fromUserId === toUserId) return;

    const newReqId = `req-${Date.now()}`;
    const newRequest: FriendRequest = { id: newReqId, fromUserId, toUserId, status: 'pending' };

    setFriendRequests(prev => ({ ...prev, [newReqId]: newRequest }));

    const updatedUsers = { ...users };
    updatedUsers[fromUserId] = { ...updatedUsers[fromUserId], outgoingFriendRequests: [...updatedUsers[fromUserId].outgoingFriendRequests, newReqId] };
    updatedUsers[toUserId] = { ...updatedUsers[toUserId], incomingFriendRequests: [...updatedUsers[toUserId].incomingFriendRequests, newReqId] };
    
    setUsers(updatedUsers);
    if (viewingProfile?.id === fromUserId) setViewingProfile(updatedUsers[fromUserId]);
    if (currentUser?.id === fromUserId) setCurrentUser(updatedUsers[fromUserId]);
    if (viewingProfile?.id === toUserId) setViewingProfile(updatedUsers[toUserId]);
  };

  const handleRespondToFriendRequest = (requestId: string, accepted: boolean) => {
    const request = friendRequests[requestId];
    if (!request) return;

    const { fromUserId, toUserId } = request;

    let updatedUsers = { ...users };
    updatedUsers[fromUserId] = { ...updatedUsers[fromUserId], outgoingFriendRequests: updatedUsers[fromUserId].outgoingFriendRequests.filter(id => id !== requestId) };
    updatedUsers[toUserId] = { ...updatedUsers[toUserId], incomingFriendRequests: updatedUsers[toUserId].incomingFriendRequests.filter(id => id !== requestId) };
    
    if (accepted) {
        updatedUsers[fromUserId].friends = [...new Set([...updatedUsers[fromUserId].friends, toUserId])];
        updatedUsers[toUserId].friends = [...new Set([...updatedUsers[toUserId].friends, fromUserId])];
    }

    setUsers(updatedUsers);
    if (currentUser?.id === fromUserId || currentUser?.id === toUserId) {
        setCurrentUser(updatedUsers[currentUser.id]);
    }

    const { [requestId]: _, ...remainingRequests } = friendRequests;
    setFriendRequests(remainingRequests);
  };

  const handleOpenPlaydateModal = (user: User, pet: Pet) => {
    setPlaydateTarget({ user, pet });
    setIsPlaydateModalOpen(true);
  };

  const handleSendPlaydateRequest = (fromPetId: string, date: string, location: string) => {
    if (!currentUser || !playdateTarget) return;

    const newPlaydateId = `pd-${Date.now()}`;
    const newPlaydate: Playdate = {
      id: newPlaydateId,
      fromPetId,
      toPetId: playdateTarget.pet.id,
      fromUserId: currentUser.id,
      toUserId: playdateTarget.user.id,
      status: 'pending',
      date,
      location,
    };

    setPlaydates(prev => ({...prev, [newPlaydateId]: newPlaydate}));
    setIsPlaydateModalOpen(false);
    setPlaydateTarget(null);
  };

  const handleRespondToPlaydateRequest = (playdateId: string, accepted: boolean) => {
      const playdate = playdates[playdateId];
      if (!playdate) return;
      
      const updatedPlaydates = {
        ...playdates,
        [playdateId]: { ...playdate, status: accepted ? 'accepted' as const : 'declined' as const }
      };
      setPlaydates(updatedPlaydates);

      if (accepted) {
        setUsers(prevUsers => {
            const newUsers = {...prevUsers};
            const fromUser = {...newUsers[playdate.fromUserId]};
            const toUser = {...newUsers[playdate.toUserId]};

            fromUser.pets = fromUser.pets.map(p => p.id === playdate.fromPetId ? {...p, friends: [...new Set([...p.friends, playdate.toPetId])] } : p);
            toUser.pets = toUser.pets.map(p => p.id === playdate.toPetId ? {...p, friends: [...new Set([...p.friends, playdate.fromPetId])] } : p);

            newUsers[playdate.fromUserId] = fromUser;
            newUsers[playdate.toUserId] = toUser;
            
            if (currentUser?.id === fromUser.id) setCurrentUser(fromUser);
            if (currentUser?.id === toUser.id) setCurrentUser(toUser);
            if (viewingProfile?.id === fromUser.id) setViewingProfile(fromUser);
            if (viewingProfile?.id === toUser.id) setViewingProfile(toUser);
            
            if (viewingPet?.id === playdate.fromPetId) {
                const updatedViewingPet = fromUser.pets.find(p => p.id === playdate.fromPetId);
                if (updatedViewingPet) setViewingPet(updatedViewingPet);
            }
            if (viewingPet?.id === playdate.toPetId) {
                const updatedViewingPet = toUser.pets.find(p => p.id === playdate.toPetId);
                if (updatedViewingPet) setViewingPet(updatedViewingPet);
            }

            return newUsers;
        });
      }
  };

  const handleRemovePetFriend = (petId: string, friendId: string) => {
    setUsers(prevUsers => {
        const newUsers = JSON.parse(JSON.stringify(prevUsers));
        let petOwnerId: string | null = null;
        let friendOwnerId: string | null = null;
        let petIndexInOwner: number = -1;
        let friendIndexInOwner: number = -1;

        for (const userId in newUsers) {
            const user = newUsers[userId];
            const pIndex = user.pets.findIndex((p: Pet) => p.id === petId);
            if (pIndex !== -1) {
                petOwnerId = userId;
                petIndexInOwner = pIndex;
            }
            const fIndex = user.pets.findIndex((p: Pet) => p.id === friendId);
            if (fIndex !== -1) {
                friendOwnerId = userId;
                friendIndexInOwner = fIndex;
            }
        }
        
        if (petOwnerId && friendOwnerId && petIndexInOwner > -1 && friendIndexInOwner > -1) {
            const pet = newUsers[petOwnerId].pets[petIndexInOwner];
            pet.friends = pet.friends.filter((id: string) => id !== friendId);
            
            const friendPet = newUsers[friendOwnerId].pets[friendIndexInOwner];
            friendPet.friends = friendPet.friends.filter((id: string) => id !== petId);

            if (currentUser?.id === petOwnerId) setCurrentUser(newUsers[petOwnerId]);
            if (currentUser?.id === friendOwnerId) setCurrentUser(newUsers[friendOwnerId]);
            if (viewingProfile?.id === petOwnerId) setViewingProfile(newUsers[petOwnerId]);
            if (viewingProfile?.id === friendOwnerId) setViewingProfile(newUsers[friendOwnerId]);
            if (viewingPet?.id === petId) setViewingPet(pet);
        }

        return newUsers;
    });
  };

  const handleOpenMessaging = (startWithUserId?: string) => {
    setIsMessagingOpen(true);
    if (startWithUserId) {
      setActiveConversationUserId(startWithUserId);
    }
  };

  const handleSendMessage = (toUserId: string, content: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId,
      content,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleStartConversation = (userId: string) => {
    setActiveConversationUserId(userId);
    setIsMessagingOpen(true);
  };


  if (authState === 'loggedOut') {
    return <Login onLogin={handleLogin} />;
  }

  if (authState === 'needsMfa') {
    return <Mfa onSubmit={handleMfaSubmit} />;
  }
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} error="An unexpected error occurred. Please log in again." />;
  }

  if (authState === 'adminDashboard') {
    return (
      <AdminDashboard
        users={Object.values(users)}
        currentUser={currentUser}
        onReturnToFeed={handleReturnToFeedFromDashboard}
        onUpdateRole={handleUpdateUserRole}
        onUpdateStatus={handleUpdateUserStatus}
      />
    );
  }

  const visibleFeedItems = feedItems
    .filter(item => {
        if (item.user.id === currentUser.id) return true;
        
        const itemOwner = users[item.user.id];
        if (!itemOwner) return false;
        const visibility = itemOwner.privacySettings.activity;

        switch (visibility) {
            case 'public':
                return true;
            case 'friends':
                return itemOwner.friends.includes(currentUser.id);
            case 'private':
                return false;
            default:
                return true;
        }
    })
    .filter(item => {
        switch(activeFilter) {
            case 'posts':
                return item.type === 'post';
            case 'activities':
                return item.type === 'activity';
            case 'friends':
                return currentUser.friends.includes(item.user.id);
            case 'all':
            default:
                return true;
        }
    });

  const MainContent: React.FC = () => {
    if (viewingPet) {
      const owner = Object.values(users).find(u => u.pets.some(p => p.id === viewingPet.id));
      return (
        <PetProfile 
          pet={viewingPet} 
          currentUser={currentUser}
          allUsers={users}
          allPlaydates={Object.values(playdates)}
          onReturn={() => setViewingPet(null)}
          onViewPet={handleViewPet}
          onViewProfile={owner ? () => handleViewProfile(owner) : undefined}
          onUpdatePetPrivacySettings={handleUpdatePetPrivacySettings}
          onAddPetPhoto={handleAddPetPhoto}
          onAddHealthLogEntry={handleAddHealthLogEntry}
          onAddPetAchievement={handleAddPetAchievement}
          onAddFavoriteItem={handleAddFavoriteItem}
          onRemovePetFriend={handleRemovePetFriend}
        />
      );
    }

    if (viewingProfile) {
      return (
        <UserProfile 
          user={viewingProfile} 
          currentUser={currentUser}
          allUsers={Object.values(users)}
          onReturnToFeed={handleReturnToFeed}
          onUpdatePrivacySettings={handleUpdatePrivacySettings}
          onViewPet={handleViewPet}
          onSendFriendRequest={handleSendFriendRequest}
          onRespondToFriendRequest={handleRespondToFriendRequest}
          onOpenPlaydateModal={handleOpenPlaydateModal}
          onStartConversation={handleStartConversation}
          onViewProfile={handleViewProfile}
        />
      );
    }

    if (currentView === 'discover') {
        return (
            <DiscoverPage
                currentUser={currentUser}
                allUsers={Object.values(users)}
                onViewProfile={handleViewProfile}
                onViewPet={handleViewPet}
            />
        );
    }
      
    return (
      <main className="max-w-2xl mx-auto py-8 px-4">
        <CreateFeedItemForm 
            currentUser={currentUser} 
            onCreatePost={handleCreatePost}
            onCreateActivity={handleCreateActivity}
        />
        <FeedFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <div className="mt-8 space-y-6">
          {visibleFeedItems.map(item => (
            item.type === 'post' ? (
                <PostCard key={item.id} post={item} onLike={handleLikeFeedItem} onViewProfile={handleViewProfile} onViewPet={handleViewPet} />
            ) : (
                <PetActivityCard key={item.id} activity={item} onLike={handleLikeFeedItem} onViewProfile={handleViewProfile} onViewPet={handleViewPet} />
            )
          ))}
        </div>
      </main>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header
        user={currentUser}
        allUsers={users}
        messages={messages}
        allFriendRequests={Object.values(friendRequests).filter(req => req.toUserId === currentUser.id)}
        allPlaydates={Object.values(playdates).filter(pd => pd.toUserId === currentUser.id && pd.status === 'pending')}
        onLogout={handleLogout}
        onNavigateToDashboard={handleNavigateToDashboard}
        onViewProfile={() => handleViewProfile(currentUser)}
        onReturnToFeed={handleReturnToFeed}
        onNavigateToDiscover={handleNavigateToDiscover}
        onRespondToFriendRequest={handleRespondToFriendRequest}
        onRespondToPlaydateRequest={handleRespondToPlaydateRequest}
        onOpenMessaging={handleOpenMessaging}
      />
      <MainContent />
       {isPlaydateModalOpen && playdateTarget && (
        <RequestPlaydateModal
          currentUser={currentUser}
          targetPet={playdateTarget.pet}
          targetUser={playdateTarget.user}
          onClose={() => setIsPlaydateModalOpen(false)}
          onSendRequest={handleSendPlaydateRequest}
        />
      )}
      {isMessagingOpen && (
        <MessagingView
          currentUser={currentUser}
          allUsers={users}
          messages={messages}
          onClose={() => setIsMessagingOpen(false)}
          onSendMessage={handleSendMessage}
          activeConversationUserId={activeConversationUserId}
          onNavigateToUser={handleViewProfile}
        />
       )}
    </div>
  );
};

export default App;
