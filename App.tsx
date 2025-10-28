
import React, { useState, useCallback } from 'react';
import { Post, User, Pet, Role, UserStatus, Visibility, PrivacySettings, FriendRequest, Playdate, PetPrivacySettings, HealthLogEntry, PetAchievement } from './types';
import Header from './components/Header';
import CreatePostForm from './components/CreatePostForm';
import PostCard from './components/PostCard';
import Login from './components/Login';
import Mfa from './components/Mfa';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import PetProfile from './components/PetProfile';
import RequestPlaydateModal from './components/RequestPlaydateModal';

const initialPets: { [key: string]: Pet } = {
  'pet-1': { 
    id: 'pet-1', 
    name: 'Buddy', 
    type: 'Dog',
    breed: 'Golden Retriever', 
    avatarUrl: 'https://picsum.photos/seed/buddy/200/200',
    birthdate: '2018-05-12',
    bio: 'Buddy is a fun-loving Golden Retriever who enjoys long walks in the park, playing fetch, and getting belly rubs. He is a certified good boy and loves meeting new friends, both human and canine!',
    photos: [
      'https://picsum.photos/seed/buddy-1/400/300',
      'https://picsum.photos/seed/buddy-2/400/300',
      'https://picsum.photos/seed/buddy-3/400/300',
    ],
    friends: [],
    privacySettings: { profile: 'public', playdates: 'friends' },
    healthLog: [
        { id: 'hl-1', type: 'Vaccination', date: '2022-06-01', notes: 'Annual booster shots.' },
        { id: 'hl-2', type: 'Vet Visit', date: '2023-01-10', notes: 'Checkup, all clear.' },
    ],
    achievements: [
        { id: 'ach-1', title: 'Certified Good Boy', date: '2019-01-15', icon: 'trophy' },
        { id: 'ach-2', title: 'Completed Puppy Training', date: '2018-09-01', icon: 'trophy' },
    ],
  },
  'pet-2': { 
    id: 'pet-2', 
    name: 'Lucy', 
    type: 'Cat',
    breed: 'Siamese', 
    avatarUrl: 'https://picsum.photos/seed/lucy/200/200',
    birthdate: '2020-09-20',
    bio: 'Lucy is a curious and vocal Siamese cat. She loves to explore high places, chase laser pointers, and take long naps in sunbeams. Her striking blue eyes can melt any heart.',
    photos: [
        'https://picsum.photos/seed/lucy-1/400/300',
        'https://picsum.photos/seed/lucy-2/400/300',
    ],
    friends: [],
    privacySettings: { profile: 'friends', playdates: 'friends' },
    healthLog: [],
    achievements: [
        { id: 'ach-3', title: 'Mastered the Art of Napping', date: '2021-03-20', icon: 'trophy' },
    ],
  },
  'pet-3': { 
    id: 'pet-3', 
    name: 'Max', 
    type: 'Dog',
    breed: 'German Shepherd', 
    avatarUrl: 'https://picsum.photos/seed/max/200/200',
    birthdate: '2017-02-01',
    bio: 'Max is a loyal and intelligent German Shepherd. He is highly protective of his family and loves learning new tricks. His favorite activity is going for a run with his owner, Bob.',
    photos: [
        'https://picsum.photos/seed/max-1/400/300',
        'https://picsum.photos/seed/max-2/400/300',
        'https://picsum.photos/seed/max-3/400/300',
        'https://picsum.photos/seed/max-4/400/300',
    ],
    friends: [],
    privacySettings: { profile: 'friends', playdates: 'private' },
    healthLog: [],
    achievements: [],
  },
  'pet-4': { 
    id: 'pet-4', 
    name: 'Chloe', 
    type: 'Cat',
    breed: 'Persian', 
    avatarUrl: 'https://picsum.photos/seed/chloe/200/200',
    birthdate: '2021-11-30',
    bio: 'Chloe is a calm and majestic Persian cat with a luxurious coat. She enjoys being pampered, gentle brushing, and quiet evenings. She is the queen of the household and she knows it.',
    photos: [
        'https://picsum.photos/seed/chloe-1/400/300',
    ],
    friends: [],
    privacySettings: { profile: 'private', playdates: 'private' },
    healthLog: [],
    achievements: [],
  },
};

const initialUsersData: { [key: string]: Omit<User, 'id'> } = {
  'user-1': { name: 'Alice Johnson', username: 'alicej', avatarUrl: 'https://picsum.photos/seed/alice/100/100', pets: [initialPets['pet-1']], role: 'admin', status: 'active', friends: ['user-2'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequests: [], outgoingFriendRequests: [] },
  'user-2': { name: 'Bob Williams', username: 'bobw', avatarUrl: 'https://picsum.photos/seed/bob/100/100', pets: [initialPets['pet-2'], initialPets['pet-3']], role: 'moderator', status: 'active', friends: ['user-1'], privacySettings: { profileBasics: 'public', pets: 'friends', activity: 'public', friends: 'friends' }, incomingFriendRequests: ['req-1'], outgoingFriendRequests: [] },
  'user-3': { name: 'Charlie Brown', username: 'charlieb', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', pets: [initialPets['pet-4']], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'friends', pets: 'friends', activity: 'private', friends: 'private' }, incomingFriendRequests: [], outgoingFriendRequests: ['req-1'] },
};

const initialUsers: { [key: string]: User } = Object.fromEntries(
  Object.entries(initialUsersData).map(([id, userData]) => [id, { id, ...userData }])
);


const initialPosts: Post[] = [
  {
    id: 'post-1',
    user: initialUsers['user-2'],
    pet: initialPets['pet-2'],
    content: 'Lucy loves her new scratching post! 😻',
    timestamp: '2 hours ago',
    likeCount: 42,
    isLiked: false,
  },
  {
    id: 'post-2',
    user: initialUsers['user-3'],
    pet: initialPets['pet-4'],
    content: 'Chloe is being majestic as usual.',
    timestamp: '5 hours ago',
    likeCount: 128,
    isLiked: true,
  },
  {
    id: 'post-3',
    user: initialUsers['user-1'],
    pet: initialPets['pet-1'],
    content: 'Buddy enjoying the sunshine at the park today! ☀️🐶',
    timestamp: '1 day ago',
    likeCount: 77,
    isLiked: false,
  },
];

const initialFriendRequests: { [key: string]: FriendRequest } = {
    'req-1': { id: 'req-1', fromUserId: 'user-3', toUserId: 'user-2', status: 'pending' },
};

const initialPlaydates: { [key: string]: Playdate } = {
    'pd-1': { id: 'pd-1', fromPetId: 'pet-1', fromUserId: 'user-1', toPetId: 'pet-4', toUserId: 'user-3', status: 'pending', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Virtual Park' }
};

type AuthState = 'loggedOut' | 'needsMfa' | 'loggedIn' | 'adminDashboard';
type LoginResult = 'success' | 'notFound' | 'suspended';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [users, setUsers] = useState<{ [key: string]: User }>(initialUsers);
  const [friendRequests, setFriendRequests] = useState<{ [key: string]: FriendRequest }>(initialFriendRequests);
  const [playdates, setPlaydates] = useState<{ [key: string]: Playdate }>(initialPlaydates);

  const [authState, setAuthState] = useState<AuthState>('loggedIn');
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers['user-2']);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);

  const [isPlaydateModalOpen, setIsPlaydateModalOpen] = useState(false);
  const [playdateTarget, setPlaydateTarget] = useState<{user: User, pet: Pet} | null>(null);

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
    setAuthState('loggedOut');
  };

  const handleCreatePost = useCallback((content: string) => {
    if (!content.trim() || !currentUser) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      content,
      timestamp: 'Just now',
      likeCount: 0,
      isLiked: false,
      pet: currentUser.pets.length > 0 ? currentUser.pets[0] : undefined,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, [currentUser]);

  const handleLikePost = useCallback((postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      })
    );
  }, []);
  
  const handleViewProfile = (user: User) => {
    setViewingPet(null);
    setViewingProfile(user);
  };
  
  const handleReturnToFeed = () => {
    setViewingPet(null);
    setViewingProfile(null);
  };

  const handleViewPet = (pet: Pet) => {
    setViewingPet(pet);
  };

  const handleNavigateToDashboard = () => {
    setViewingProfile(null);
    setViewingPet(null);
    setAuthState('adminDashboard');
  };
  
  const handleReturnToFeedFromDashboard = () => {
    setViewingProfile(null);
    setViewingPet(null);
    setAuthState('loggedIn');
  };

  const handleUpdateUserRole = (userId: string, role: Role) => {
    const updatedUsers = {
      ...users,
      [userId]: { ...users[userId], role }
    };
    setUsers(updatedUsers);

    setPosts(prevPosts => prevPosts.map(post => 
      post.user.id === userId ? { ...post, user: updatedUsers[userId] } : post
    ));
  };

  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    const updatedUsers = {
      ...users,
      [userId]: { ...users[userId], status }
    };
    setUsers(updatedUsers);
    
    setPosts(prevPosts => prevPosts.map(post => 
      post.user.id === userId ? { ...post, user: updatedUsers[userId] } : post
    ));
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
      
      if(viewingProfile?.id === userId) {
        setViewingProfile(updatedUser);
      }
      if(currentUser?.id === userId) {
        setCurrentUser(updatedUser);
      }
      
      setPosts(prevPosts => prevPosts.map(post => 
        post.user.id === userId ? { ...post, user: updatedUser } : post
      ));
    }
  };

  const handleUpdatePetPrivacySettings = (petId: string, section: keyof PetPrivacySettings, visibility: Visibility | 'private' | 'friends') => {
      setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        let ownerId: string | null = null;
        
        // Find owner and update pet
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
                if (viewingPet?.id === petId) {
                    setViewingPet(updatedPet);
                }
                break;
            }
        }

        if (ownerId) {
          if (currentUser?.id === ownerId) {
            setCurrentUser(newUsers[ownerId]);
          }
          if (viewingProfile?.id === ownerId) {
            setViewingProfile(newUsers[ownerId]);
          }
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
                if (viewingPet?.id === petId) {
                    setViewingPet(updatedPet);
                }
                break;
            }
        }
        
        if (ownerId) {
          if (currentUser?.id === ownerId) {
            setCurrentUser(newUsers[ownerId]);
          }
          if (viewingProfile?.id === ownerId) {
            setViewingProfile(newUsers[ownerId]);
          }
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
                if (viewingPet?.id === petId) {
                    setViewingPet(updatedPet);
                }
                break;
            }
        }
        
        if (ownerId) {
          if (currentUser?.id === ownerId) {
            setCurrentUser(newUsers[ownerId]);
          }
          if (viewingProfile?.id === ownerId) {
            setViewingProfile(newUsers[ownerId]);
          }
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
          if (viewingPet?.id === petId) {
            setViewingPet(updatedPet);
          }
          break;
        }
      }

      if (ownerId) {
        if (currentUser?.id === ownerId) {
          setCurrentUser(newUsers[ownerId]);
        }
        if (viewingProfile?.id === ownerId) {
          setViewingProfile(newUsers[ownerId]);
        }
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
    if (currentUser?.id === toUserId) setCurrentUser(updatedUsers[toUserId]);
  };

  const handleRespondToFriendRequest = (requestId: string, accepted: boolean) => {
    const request = friendRequests[requestId];
    if (!request) return;

    const { fromUserId, toUserId } = request;

    let updatedUsers = { ...users };
    updatedUsers[fromUserId] = { ...updatedUsers[fromUserId], outgoingFriendRequests: updatedUsers[fromUserId].outgoingFriendRequests.filter(id => id !== requestId) };
    updatedUsers[toUserId] = { ...updatedUsers[toUserId], incomingFriendRequests: updatedUsers[toUserId].incomingFriendRequests.filter(id => id !== requestId) };
    
    if (accepted) {
        updatedUsers[fromUserId].friends = [...updatedUsers[fromUserId].friends, toUserId];
        updatedUsers[toUserId].friends = [...updatedUsers[toUserId].friends, fromUserId];
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
        // Fix: Use 'as const' to assert literal types for 'status', preventing type widening to 'string'.
        [playdateId]: { ...playdate, status: accepted ? 'accepted' as const : 'declined' as const }
      };
      setPlaydates(updatedPlaydates);

      if (accepted) {
        setUsers(prevUsers => {
            const newUsers = {...prevUsers};
            const fromUser = {...newUsers[playdate.fromUserId]};
            const toUser = {...newUsers[playdate.toUserId]};

            fromUser.pets = fromUser.pets.map(p => p.id === playdate.fromPetId ? {...p, friends: [...p.friends, playdate.toPetId] } : p);
            toUser.pets = toUser.pets.map(p => p.id === playdate.toPetId ? {...p, friends: [...p.friends, playdate.fromPetId] } : p);

            newUsers[playdate.fromUserId] = fromUser;
            newUsers[playdate.toUserId] = toUser;
            
            if (currentUser?.id === fromUser.id) setCurrentUser(fromUser);
            if (currentUser?.id === toUser.id) setCurrentUser(toUser);
            if (viewingProfile?.id === fromUser.id) setViewingProfile(fromUser);
            if (viewingProfile?.id === toUser.id) setViewingProfile(toUser);
            
            return newUsers;
        });
      }
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

  const visiblePosts = posts.filter(post => {
    if (post.user.id === currentUser.id) return true; // Always see your own posts
    
    const postUser = users[post.user.id];
    const visibility = postUser.privacySettings.activity;

    switch (visibility) {
        case 'public':
            return true;
        case 'friends':
            return postUser.friends.includes(currentUser.id);
        case 'private':
            return false;
        default:
            return true;
    }
  });

  const MainContent: React.FC = () => {
    if (viewingPet) {
      return (
        <PetProfile 
          pet={viewingPet} 
          currentUser={currentUser}
          allUsers={users}
          allPlaydates={Object.values(playdates)}
          onReturn={() => setViewingPet(null)}
          onViewPet={handleViewPet}
          onUpdatePetPrivacySettings={handleUpdatePetPrivacySettings}
          onAddPetPhoto={handleAddPetPhoto}
          onAddHealthLogEntry={handleAddHealthLogEntry}
          onAddPetAchievement={handleAddPetAchievement}
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
        />
      );
    }
      
    return (
      <main className="max-w-2xl mx-auto py-8 px-4">
        <CreatePostForm onCreatePost={handleCreatePost} user={currentUser} />
        <div className="mt-8 space-y-6">
          {visiblePosts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLikePost} onViewProfile={handleViewProfile} />
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
        allFriendRequests={Object.values(friendRequests).filter(req => req.toUserId === currentUser.id)}
        allPlaydates={Object.values(playdates).filter(pd => pd.toUserId === currentUser.id && pd.status === 'pending')}
        onLogout={handleLogout}
        onNavigateToDashboard={handleNavigateToDashboard}
        onViewProfile={() => handleViewProfile(currentUser)}
        onRespondToFriendRequest={handleRespondToFriendRequest}
        onRespondToPlaydateRequest={handleRespondToPlaydateRequest}
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
    </div>
  );
};

export default App;