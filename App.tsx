import React, { useState, useCallback } from 'react';
import { Post, User, Pet, Role, UserStatus, Visibility, PrivacySettings } from './types';
import Header from './components/Header';
import CreatePostForm from './components/CreatePostForm';
import PostCard from './components/PostCard';
import Login from './components/Login';
import Mfa from './components/Mfa';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import PetProfile from './components/PetProfile';

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
  },
};

const initialUsersData: { [key: string]: Omit<User, 'id'> } = {
  'user-1': { name: 'Alice Johnson', username: 'alicej', avatarUrl: 'https://picsum.photos/seed/alice/100/100', pets: [initialPets['pet-1']], role: 'admin', status: 'active', friends: ['user-2'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public' } },
  'user-2': { name: 'Bob Williams', username: 'bobw', avatarUrl: 'https://picsum.photos/seed/bob/100/100', pets: [initialPets['pet-2'], initialPets['pet-3']], role: 'moderator', status: 'active', friends: ['user-1', 'user-3'], privacySettings: { profileBasics: 'public', pets: 'friends', activity: 'public' } },
  'user-3': { name: 'Charlie Brown', username: 'charlieb', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', pets: [initialPets['pet-4']], role: 'user', status: 'active', friends: ['user-2'], privacySettings: { profileBasics: 'friends', pets: 'friends', activity: 'private' } },
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

type AuthState = 'loggedOut' | 'needsMfa' | 'loggedIn' | 'adminDashboard';
type LoginResult = 'success' | 'notFound' | 'suspended';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [users, setUsers] = useState<{ [key: string]: User }>(initialUsers);
  const [authState, setAuthState] = useState<AuthState>('loggedIn');
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers['user-3']);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);

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
          onReturn={() => setViewingPet(null)}
        />
      );
    }

    if (viewingProfile) {
      return (
        <UserProfile 
          user={viewingProfile} 
          currentUser={currentUser}
          onReturnToFeed={handleReturnToFeed}
          onUpdatePrivacySettings={handleUpdatePrivacySettings}
          onViewPet={handleViewPet}
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
        onLogout={handleLogout}
        onNavigateToDashboard={handleNavigateToDashboard}
        onViewProfile={() => handleViewProfile(currentUser)}
      />
      <MainContent />
    </div>
  );
};

export default App;