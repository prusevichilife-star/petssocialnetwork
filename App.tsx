
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, Pet, Role, UserStatus, Visibility, PrivacySettings, FriendRequest, Playdate, PetPrivacySettings, HealthLogEntry, PetAchievement, FavoriteItem, FeedItem, Post, ActivityFeedItem, Message, UserDatabase } from './types';
import { initDB, getAllUsersData, getUserData, setUserData } from './database';
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

// Initialize DB on script load
initDB();
const initialAllUserData = getAllUsersData();


type AuthState = 'loggedOut' | 'needsMfa' | 'loggedIn' | 'adminDashboard';
type CurrentView = 'feed' | 'discover';
type LoginResult = 'success' | 'notFound' | 'suspended';
export type FilterType = 'all' | 'posts' | 'activities' | 'friends';

// Enriched types for UI
export interface EnrichedPost extends Post { user: User; pet?: Pet; isLiked: boolean; }
export interface EnrichedActivity extends ActivityFeedItem { user: User; pet: Pet; isLiked: boolean; }
export type EnrichedFeedItem = EnrichedPost | EnrichedActivity;


const App: React.FC = () => {
  const [allUserData, setAllUserData] = useState<Record<string, UserDatabase>>(initialAllUserData);
  
  const [authState, setAuthState] = useState<AuthState>('loggedIn');
  // FIX: Cast to UserDatabase to access 'user' property, avoiding 'unknown' type error.
  const [currentUser, setCurrentUser] = useState<User | null>((allUserData['user-1'] as UserDatabase)?.user || null);
  
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);
  const [currentView, setCurrentView] = useState<CurrentView>('feed');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const [isPlaydateModalOpen, setIsPlaydateModalOpen] = useState(false);
  const [playdateTarget, setPlaydateTarget] = useState<{user: User, pet: Pet} | null>(null);

  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);

  const allUsersMap = useMemo(() => Object.fromEntries(Object.values(allUserData).map(ud => [(ud as UserDatabase).user.id, (ud as UserDatabase).user])), [allUserData]);
  const allUsersList = useMemo(() => Object.values(allUsersMap), [allUsersMap]);

  useEffect(() => {
    if (currentUser) {
      // Keep currentUser in sync with the main state
      setCurrentUser(allUsersMap[currentUser.id] || null);
    }
  }, [allUsersMap, currentUser]);

  const handleLogin = (username: string): LoginResult => {
    const user = allUsersList.find(u => u.username === username);
    if (user) {
      if (user.status === 'suspended') return 'suspended';
      setCurrentUser(user);
      setAuthState('needsMfa');
      return 'success';
    }
    return 'notFound';
  };

  const handleMfaSubmit = (trustDevice: boolean) => {
    if (currentUser && trustDevice) localStorage.setItem('trustedUser', currentUser.username);
    setAuthState('loggedIn');
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
    const userDb = getUserData(currentUser.id);
    if (!userDb) return;
    
    const newPost: Post = {
      id: `post-${Date.now()}`, type: 'post', userId: currentUser.id, content,
      date: new Date().toISOString(), likeCount: 0,
      petId: petId || (currentUser.pets.length === 1 ? currentUser.pets[0].id : undefined),
    };

    userDb.posts.unshift(newPost);
    setUserData(currentUser.id, userDb);
    setAllUserData(prev => ({...prev, [currentUser.id]: userDb }));
  }, [currentUser]);
  
  const handleCreateActivity = useCallback((activityData: Omit<ActivityFeedItem, 'id'|'type'|'userId'|'petId'|'likeCount'>, petId: string) => {
    if (!currentUser) return;
    const userDb = getUserData(currentUser.id);
    const pet = currentUser.pets.find(p => p.id === petId);
    if (!pet || !userDb) return;

    const newActivity: ActivityFeedItem = {
        ...activityData, id: `act-${Date.now()}`, type: 'activity',
        userId: currentUser.id, petId: pet.id, likeCount: 0,
    };
    
    userDb.activities.push(newActivity);
    userDb.activities.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setUserData(currentUser.id, userDb);
    setAllUserData(prev => ({...prev, [currentUser.id]: userDb }));
  }, [currentUser]);

  const handleLikeFeedItem = useCallback((itemId: string, ownerId: string) => {
    if (!currentUser) return;

    const ownerDb = getUserData(ownerId);
    const currentUserDb = ownerId === currentUser.id ? ownerDb : getUserData(currentUser.id);
    if (!ownerDb || !currentUserDb) return;

    const isLiked = currentUserDb.user.likedFeedItems.includes(itemId);
    let item: Post | ActivityFeedItem | undefined = ownerDb.posts.find(p => p.id === itemId) || ownerDb.activities.find(a => a.id === itemId);

    if (item) {
        if (isLiked) {
            item.likeCount--;
            currentUserDb.user.likedFeedItems = currentUserDb.user.likedFeedItems.filter(id => id !== itemId);
        } else {
            item.likeCount++;
            currentUserDb.user.likedFeedItems.push(itemId);
        }

        setUserData(ownerId, ownerDb);
        if(ownerId !== currentUser.id) setUserData(currentUser.id, currentUserDb);
        
        setAllUserData(prev => ({
            ...prev,
            [ownerId]: ownerDb,
            [currentUser.id]: currentUserDb
        }));
    }
  }, [currentUser]);
  
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

  const handleNavigateToDashboard = () => setAuthState('adminDashboard');
  const handleReturnToFeedFromDashboard = () => setAuthState('loggedIn');
  const handleNavigateToDiscover = () => {
    setViewingProfile(null);
    setViewingPet(null);
    setCurrentView('discover');
  };

  const handleUpdateUserRole = (userId: string, role: Role) => {
    const userDb = getUserData(userId);
    if (!userDb) return;
    userDb.user.role = role;
    setUserData(userId, userDb);
    setAllUserData(prev => ({...prev, [userId]: userDb}));
  };

  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    const userDb = getUserData(userId);
    if (!userDb) return;
    userDb.user.status = status;
    setUserData(userId, userDb);
    setAllUserData(prev => ({...prev, [userId]: userDb}));
  };
  
  const handleUpdatePrivacySettings = (userId: string, section: keyof PrivacySettings, visibility: Visibility) => {
    const userDb = getUserData(userId);
    if (!userDb) return;
    userDb.user.privacySettings[section] = visibility;
    setUserData(userId, userDb);
    setAllUserData(prev => ({...prev, [userId]: userDb}));
    if (viewingProfile?.id === userId) setViewingProfile(userDb.user);
  };

  const handleUpdatePetPrivacySettings = (petId: string, section: keyof PetPrivacySettings, visibility: Visibility | 'private' | 'friends') => {
      const owner = allUsersList.find(u => u.pets.some(p => p.id === petId));
      if (!owner) return;
      const ownerDb = getUserData(owner.id);
      if (!ownerDb) return;
      
      const pet = ownerDb.user.pets.find(p => p.id === petId);
      // FIX: The type for pet privacy settings is more restrictive for 'playdates'
      // than for 'profile'. This conditional assignment ensures type safety.
      if (pet) {
        if (section === 'profile') {
          pet.privacySettings[section] = visibility;
        } else if (section === 'playdates' && visibility !== 'public') {
          pet.privacySettings[section] = visibility;
        }
      }

      setUserData(owner.id, ownerDb);
      setAllUserData(prev => ({...prev, [owner.id]: ownerDb}));
      if (viewingPet?.id === petId && pet) setViewingPet(pet);
  };

  const handleAddPetData = (petId: string, updateFn: (pet: Pet) => void) => {
    const owner = allUsersList.find(u => u.pets.some(p => p.id === petId));
    if (!owner) return;
    const ownerDb = getUserData(owner.id);
    if (!ownerDb) return;
    
    const pet = ownerDb.user.pets.find(p => p.id === petId);
    if (pet) {
      updateFn(pet);
      setUserData(owner.id, ownerDb);
      setAllUserData(prev => ({...prev, [owner.id]: ownerDb}));
      if (viewingPet?.id === petId) setViewingPet(pet);
    }
  };

  const handleAddPetPhoto = (petId: string, photoUrl: string) => handleAddPetData(petId, pet => pet.photos.push(photoUrl));
  const handleAddHealthLogEntry = (petId: string, newEntry: Omit<HealthLogEntry, 'id'>) => handleAddPetData(petId, pet => {
    if (!pet.healthLog) pet.healthLog = [];
    pet.healthLog.push({ ...newEntry, id: `hl-${Date.now()}` });
  });
  const handleAddPetAchievement = (petId: string, newAchievement: Omit<PetAchievement, 'id'>) => handleAddPetData(petId, pet => {
    if (!pet.achievements) pet.achievements = [];
    pet.achievements.push({ ...newAchievement, id: `ach-${Date.now()}` });
  });
  const handleAddFavoriteItem = (petId: string, newItem: Omit<FavoriteItem, 'id'>) => handleAddPetData(petId, pet => {
    if (!pet.favoriteItems) pet.favoriteItems = [];
    pet.favoriteItems.push({ ...newItem, id: `fav-${Date.now()}` });
  });

  const handleSendFriendRequest = (toUserId: string) => {
    if (!currentUser || currentUser.id === toUserId) return;
    const fromUserId = currentUser.id;
    
    const fromDb = getUserData(fromUserId);
    const toDb = getUserData(toUserId);
    if (!fromDb || !toDb) return;

    const newReq: FriendRequest = { id: `req-${Date.now()}`, fromUserId, toUserId, status: 'pending' };
    fromDb.user.outgoingFriendRequests.push(newReq);
    toDb.user.incomingFriendRequests.push(newReq);

    setUserData(fromUserId, fromDb);
    setUserData(toUserId, toDb);
    setAllUserData(prev => ({ ...prev, [fromUserId]: fromDb, [toUserId]: toDb }));
  };

  const handleRespondToFriendRequest = (requestId: string, accepted: boolean) => {
    const request = allUsersList.flatMap(u => [...u.incomingFriendRequests, ...u.outgoingFriendRequests]).find(r => r.id === requestId);
    if (!request || !currentUser) return;
    
    const { fromUserId, toUserId } = request;
    const fromDb = getUserData(fromUserId);
    const toDb = getUserData(toUserId);
    if (!fromDb || !toDb) return;

    fromDb.user.outgoingFriendRequests = fromDb.user.outgoingFriendRequests.filter(r => r.id !== requestId);
    toDb.user.incomingFriendRequests = toDb.user.incomingFriendRequests.filter(r => r.id !== requestId);
    
    if (accepted) {
        fromDb.user.friends = [...new Set([...fromDb.user.friends, toUserId])];
        toDb.user.friends = [...new Set([...toDb.user.friends, fromUserId])];
    }

    setUserData(fromUserId, fromDb);
    setUserData(toUserId, toDb);
    setAllUserData(prev => ({ ...prev, [fromUserId]: fromDb, [toUserId]: toDb }));
  };

  const handleOpenPlaydateModal = (user: User, pet: Pet) => {
    setPlaydateTarget({ user, pet });
    setIsPlaydateModalOpen(true);
  };

  const handleSendPlaydateRequest = (fromPetId: string, date: string, location: string) => {
    if (!currentUser || !playdateTarget) return;
    const fromDb = getUserData(currentUser.id);
    const toDb = getUserData(playdateTarget.user.id);
    if (!fromDb || !toDb) return;

    const newPlaydate: Playdate = {
      id: `pd-${Date.now()}`, fromPetId, toPetId: playdateTarget.pet.id,
      fromUserId: currentUser.id, toUserId: playdateTarget.user.id,
      status: 'pending', date, location,
    };

    fromDb.playdates.push(newPlaydate);
    toDb.playdates.push(newPlaydate);
    setUserData(currentUser.id, fromDb);
    setUserData(playdateTarget.user.id, toDb);
    setAllUserData(prev => ({...prev, [currentUser.id]: fromDb, [playdateTarget.user.id]: toDb }));
    
    setIsPlaydateModalOpen(false);
    setPlaydateTarget(null);
  };
  
  const handleRespondToPlaydateRequest = (playdateId: string, accepted: boolean) => {
      const allPlaydates = Object.values(allUserData).flatMap(ud => (ud as UserDatabase).playdates);
      const playdate = allPlaydates.find(p => p.id === playdateId);
      if (!playdate) return;
      
      const fromDb = getUserData(playdate.fromUserId);
      const toDb = getUserData(playdate.toUserId);
      if (!fromDb || !toDb) return;
      
      const updateStatus = (pd: Playdate) => pd.status = accepted ? 'accepted' : 'declined';
      fromDb.playdates.find(p => p.id === playdateId)!.status = accepted ? 'accepted' : 'declined';
      toDb.playdates.find(p => p.id === playdateId)!.status = accepted ? 'accepted' : 'declined';

      if (accepted) {
          const fromPet = fromDb.user.pets.find(p => p.id === playdate.fromPetId);
          const toPet = toDb.user.pets.find(p => p.id === playdate.toPetId);
          if (fromPet && toPet) {
              fromPet.friends = [...new Set([...fromPet.friends, toPet.id])];
              toPet.friends = [...new Set([...toPet.friends, fromPet.id])];
          }
      }
      
      setUserData(fromDb.user.id, fromDb);
      setUserData(toDb.user.id, toDb);
      setAllUserData(prev => ({...prev, [fromDb.user.id]: fromDb, [toDb.user.id]: toDb}));
  };

  const handleRemovePetFriend = (petId: string, friendId: string) => {
      const petOwner = allUsersList.find(u => u.pets.some(p => p.id === petId));
      const friendOwner = allUsersList.find(u => u.pets.some(p => p.id === friendId));
      if (!petOwner || !friendOwner) return;

      const petOwnerDb = getUserData(petOwner.id);
      const friendOwnerDb = getUserData(friendOwner.id);
      if (!petOwnerDb || !friendOwnerDb) return;

      const pet = petOwnerDb.user.pets.find(p => p.id === petId);
      const friendPet = friendOwnerDb.user.pets.find(p => p.id === friendId);

      if (pet) pet.friends = pet.friends.filter(id => id !== friendId);
      if (friendPet) friendPet.friends = friendPet.friends.filter(id => id !== petId);

      setUserData(petOwner.id, petOwnerDb);
      setUserData(friendOwner.id, friendOwnerDb);
      setAllUserData(prev => ({...prev, [petOwner.id]: petOwnerDb, [friendOwner.id]: friendOwnerDb}));
      if (viewingPet?.id === petId && pet) setViewingPet(pet);
  };
  
  const handleOpenMessaging = (startWithUserId?: string) => {
    setIsMessagingOpen(true);
    if (startWithUserId) setActiveConversationUserId(startWithUserId);
  };

  const handleSendMessage = (toUserId: string, content: string) => {
    if (!currentUser) return;
    const fromDb = getUserData(currentUser.id);
    const toDb = getUserData(toUserId);
    if (!fromDb || !toDb) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`, fromUserId: currentUser.id, toUserId, content,
      timestamp: new Date().toISOString(), read: false,
    };
    fromDb.messages.push({ ...newMessage, read: true });
    toDb.messages.push(newMessage);

    setUserData(currentUser.id, fromDb);
    setUserData(toUserId, toDb);
    setAllUserData(prev => ({...prev, [currentUser.id]: fromDb, [toUserId]: toDb }));
  };

  const handleStartConversation = (userId: string) => {
    setActiveConversationUserId(userId);
    setIsMessagingOpen(true);
  };


  if (authState === 'loggedOut' || !currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (authState === 'needsMfa') {
    return <Mfa onSubmit={handleMfaSubmit} />;
  }
  
  if (authState === 'adminDashboard') {
    return <AdminDashboard users={allUsersList} currentUser={currentUser} onReturnToFeed={handleReturnToFeedFromDashboard} onUpdateRole={handleUpdateUserRole} onUpdateStatus={handleUpdateUserStatus} />;
  }

  const visibleFeedItems: EnrichedFeedItem[] = useMemo(() => {
    const visibleUserIds = allUsersList
        .filter(owner => {
            if (owner.id === currentUser.id) return true;
            const visibility = owner.privacySettings.activity;
            if (visibility === 'public') return true;
            if (visibility === 'friends' && owner.friends.includes(currentUser.id)) return true;
            return false;
        })
        .map(u => u.id);
    
    const feed: EnrichedFeedItem[] = [];
    visibleUserIds.forEach(userId => {
        const userDb = allUserData[userId];
        if (userDb) {
            const owner = (userDb as UserDatabase).user;
            (userDb as UserDatabase).posts.forEach(p => feed.push({ ...p, user: owner, pet: owner.pets.find(pet => pet.id === p.petId), isLiked: currentUser.likedFeedItems.includes(p.id) }));
            (userDb as UserDatabase).activities.forEach(a => feed.push({ ...a, user: owner, pet: owner.pets.find(pet => pet.id === a.petId)!, isLiked: currentUser.likedFeedItems.includes(a.id) }));
        }
    });
    
    return feed
      .filter(item => {
        switch(activeFilter) {
            case 'posts': return item.type === 'post';
            case 'activities': return item.type === 'activity';
            case 'friends': return currentUser.friends.includes(item.userId);
            case 'all': default: return true;
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allUserData, currentUser, activeFilter]);

  const MainContent: React.FC = () => {
    if (viewingPet) {
      const owner = allUsersList.find(u => u.pets.some(p => p.id === viewingPet.id));
      return (
        <PetProfile 
          pet={viewingPet} currentUser={currentUser} allUsers={allUsersMap}
          allPlaydates={Object.values(allUserData).flatMap(ud => (ud as UserDatabase).playdates)}
          onReturn={() => setViewingPet(null)} onViewPet={handleViewPet}
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
          user={viewingProfile} currentUser={currentUser} allUsers={allUsersList}
          onReturnToFeed={handleReturnToFeed} onUpdatePrivacySettings={handleUpdatePrivacySettings}
          onViewPet={handleViewPet} onSendFriendRequest={handleSendFriendRequest}
          onRespondToFriendRequest={handleRespondToFriendRequest} onOpenPlaydateModal={handleOpenPlaydateModal}
          onStartConversation={handleStartConversation} onViewProfile={handleViewProfile}
        />
      );
    }
    if (currentView === 'discover') {
        return <DiscoverPage currentUser={currentUser} allUsers={allUsersList} onViewProfile={handleViewProfile} onViewPet={handleViewPet} />;
    }
    return (
      <main className="max-w-2xl mx-auto py-8 px-4">