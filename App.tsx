



import React from 'react';
import { User, Pet, Role, UserStatus, Visibility, PrivacySettings, FriendRequest, Playdate, PetPrivacySettings, HealthLogEntry, PetAchievement, FavoriteItem, FeedItem, Post, ActivityFeedItem, Message, Group } from './types';
import { 
    initDB, 
    getAllData,
    createPost,
    createActivity,
    likeFeedItem,
    updateUserRole,
    updateUserStatus,
    updatePrivacySettings,
    updatePetPrivacySettings,
    updatePetLocation as dbUpdatePetLocation,
    addPetPhoto as dbAddPetPhoto,
    addHealthLogEntry as dbAddHealthLogEntry,
    addPetAchievement as dbAddPetAchievement,
    addFavoriteItem as dbAddFavoriteItem,
    sendFriendRequest,
    respondToFriendRequest,
    sendPlaydateRequest,
    respondToPlaydateRequest,
    removePetFriend,
    sendMessage as dbSendMessage,
    createGroup,
    joinGroup,
    leaveGroup,
} from './database';
import Header from './components/Header';
import Login from './components/Login';
import Mfa from './components/Mfa';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import PetProfile from './components/PetProfile';
import DiscoverPage from './components/DiscoverPage';
import MessagingView from './components/MessagingView';
import Sidebar from './components/Sidebar';
import FeedView from './components/FeedView';
import GroupsPage from './components/GroupsPage';
import GroupProfilePage from './components/GroupProfilePage';

export type AuthState = 'loggedOut' | 'needsMfa' | 'loggedIn';
export type CurrentView = 'feed' | 'discover' | 'profile' | 'pet' | 'admin' | 'messages' | 'groups' | 'group';
type LoginResult = 'success' | 'notFound' | 'suspended';

// Enriched types for UI
export interface EnrichedPost extends Post { user: User; pet?: Pet; isLiked: boolean; }
export interface EnrichedActivity extends ActivityFeedItem { user: User; pet: Pet; isLiked: boolean; }
export type EnrichedFeedItem = EnrichedPost | EnrichedActivity;

const App: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [allUsers, setAllUsers] = React.useState<User[]>([]);
    const [allPosts, setAllPosts] = React.useState<Post[]>([]);
    const [allActivities, setAllActivities] = React.useState<ActivityFeedItem[]>([]);
    const [allPlaydates, setAllPlaydates] = React.useState<Playdate[]>([]);
    const [allMessages, setAllMessages] = React.useState<Message[]>([]);
    const [allGroups, setAllGroups] = React.useState<Group[]>([]);
  
    const [authState, setAuthState] = React.useState<AuthState>('loggedOut');
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  
    const [currentView, setCurrentView] = React.useState<CurrentView>('feed');
    const [viewingUserId, setViewingUserId] = React.useState<string | null>(null);
    const [viewingPetId, setViewingPetId] = React.useState<string | null>(null);
    const [viewingGroupId, setViewingGroupId] = React.useState<string | null>(null);
    const [activeConversationUserId, setActiveConversationUserId] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        try {
            const data = await getAllData();
            setAllUsers(data.users);
            setAllPosts(data.posts);
            setAllActivities(data.activities);
            setAllPlaydates(data.playdates);
            setAllMessages(data.messages);
            setAllGroups(data.groups);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        const initialize = async () => {
            try {
                await initDB();
                await fetchData();
                
                const trustedUsername = localStorage.getItem('trustedUser');
                if (trustedUsername) {
                    const data = await getAllData(); // Re-fetch to ensure we have the latest data for auto-login
                    const user = data.users.find(u => u.username === trustedUsername);
                    if (user && user.status === 'active') {
                        setCurrentUser(user);
                        setAuthState('loggedIn');
                    } else {
                         localStorage.removeItem('trustedUser');
                    }
                }
            } catch (error) {
                console.error("Initialization failed:", error);
                setIsLoading(false); // Stop loading on failure
            }
        };
        initialize();
    }, [fetchData]);

    const allUsersMap = React.useMemo(() => Object.fromEntries(allUsers.map(u => [u.id, u])), [allUsers]);

    React.useEffect(() => {
        if (currentUser) {
            setCurrentUser(allUsersMap[currentUser.id] || null);
        }
    }, [allUsersMap, currentUser]);

    // Handlers
    const handleLogin = (username: string): LoginResult => {
        const user = allUsers.find(u => u.username === username);
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
        setCurrentView('feed');
        setViewingUserId(null);
        setViewingPetId(null);
        setViewingGroupId(null);
        setAuthState('loggedOut');
    };
    
    const navigate = (view: CurrentView, id?: string) => {
        setCurrentView(view);
        setViewingUserId(null);
        setViewingPetId(null);
        setViewingGroupId(null);

        if (view !== 'messages') {
          setActiveConversationUserId(null);
        }

        if (view === 'profile' && id) setViewingUserId(id);
        if (view === 'pet' && id) setViewingPetId(id);
        if (view === 'group' && id) setViewingGroupId(id);
        if (view === 'messages' && id) setActiveConversationUserId(id);
    };

    const handleCreatePost = async (content: string, petId?: string, groupId?: string) => {
        if (!currentUser) return;
        await createPost(currentUser.id, content, petId, groupId);
        await fetchData();
    };
  
    const handleCreateActivity = async (activityData: Omit<ActivityFeedItem, 'id'|'type'|'userId'|'petId'|'likeCount'>, petId: string) => {
        if (!currentUser) return;
        await createActivity(currentUser.id, petId, activityData);
        await fetchData();
    };

    const handleLikeFeedItem = async (itemId: string) => {
        if (!currentUser) return;
        await likeFeedItem(currentUser.id, itemId);
        await fetchData();
    };

    const handleUpdateUserRole = async (userId: string, role: Role) => {
        await updateUserRole(userId, role);
        await fetchData();
    };

    const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
        await updateUserStatus(userId, status);
        await fetchData();
    };
  
    const handleUpdatePrivacySettings = async (userId: string, section: keyof PrivacySettings, visibility: Visibility) => {
        await updatePrivacySettings(userId, section, visibility);
        await fetchData();
    };

    const handleUpdatePetPrivacySettings = async (petId: string, section: keyof PetPrivacySettings, visibility: Visibility | 'private' | 'friends') => {
        await updatePetPrivacySettings(petId, section, visibility);
        await fetchData();
    };
    
    const handleAddPetPhoto = async (petId: string, photoUrl: string) => { await dbAddPetPhoto(petId, photoUrl); await fetchData(); };
    const handleAddHealthLogEntry = async (petId: string, newEntry: Omit<HealthLogEntry, 'id'>) => { await dbAddHealthLogEntry(petId, newEntry); await fetchData(); };
    const handleAddPetAchievement = async (petId: string, newAchievement: Omit<PetAchievement, 'id'>) => { await dbAddPetAchievement(petId, newAchievement); await fetchData(); };
    const handleAddFavoriteItem = async (petId: string, newItem: Omit<FavoriteItem, 'id'>) => { await dbAddFavoriteItem(petId, newItem); await fetchData(); };
    const handleSendFriendRequest = async (toUserId: string) => { if (!currentUser) return; await sendFriendRequest(currentUser.id, toUserId); await fetchData(); };
    const handleRespondToFriendRequest = async (requestId: string, accepted: boolean) => { await respondToFriendRequest(requestId, accepted); await fetchData(); };
    const handleSendPlaydateRequest = async (fromPetId: string, toUserId: string, toPetId: string, date: string, location: string) => { if (!currentUser) return; await sendPlaydateRequest(currentUser.id, fromPetId, toUserId, toPetId, date, location); await fetchData(); };
    const handleRespondToPlaydateRequest = async (playdateId: string, accepted: boolean) => { await respondToPlaydateRequest(playdateId, accepted); await fetchData(); };
    const handleRemovePetFriend = async (petId: string, friendId: string) => { await removePetFriend(petId, friendId); await fetchData(); };
    const handleSendMessage = async (toUserId: string, content: string) => { if (!currentUser) return; await dbSendMessage(currentUser.id, toUserId, content); await fetchData(); };
    const handleUpdatePetLocation = async (petId: string, location: string) => { await dbUpdatePetLocation(petId, location); await fetchData(); };

    const handleCreateGroup = async (name: string, description: string, visibility: 'public' | 'private') => {
        if (!currentUser) return;
        await createGroup(currentUser.id, name, description, visibility);
        await fetchData();
    };
    const handleJoinGroup = async (groupId: string) => { if (!currentUser) return; await joinGroup(currentUser.id, groupId); await fetchData(); };
    const handleLeaveGroup = async (groupId: string) => { if (!currentUser) return; await leaveGroup(currentUser.id, groupId); await fetchData(); };

    // Render logic
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-lg font-semibold">Loading PetSocial...</div>;
    }

    if (authState === 'loggedOut' || !currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    if (authState === 'needsMfa') {
        return <Mfa onSubmit={handleMfaSubmit} />;
    }

    const viewingUser = viewingUserId ? allUsersMap[viewingUserId] : null;
    const viewingPet = viewingPetId ? allUsers.flatMap(u => u.pets).find(p => p.id === viewingPetId) : null;
    const viewingGroup = viewingGroupId ? allGroups.find(g => g.id === viewingGroupId) : null;

    const renderContent = () => {
        switch(currentView) {
            case 'feed':
                return <FeedView 
                            currentUser={currentUser} 
                            allUsers={allUsers}
                            allPosts={allPosts}
                            allActivities={allActivities}
                            onNavigate={navigate}
                            onLikeFeedItem={handleLikeFeedItem}
                            onCreatePost={handleCreatePost}
                            onCreateActivity={handleCreateActivity}
                        />;
            case 'discover':
                return <DiscoverPage currentUser={currentUser} allUsers={allUsers} allGroups={allGroups} onNavigate={navigate} />;
            case 'profile':
                return viewingUser ? <UserProfile 
                                        user={viewingUser}
                                        currentUser={currentUser}
                                        allUsers={allUsers}
                                        onNavigate={navigate}
                                        onUpdatePrivacySettings={handleUpdatePrivacySettings}
                                        onSendFriendRequest={handleSendFriendRequest}
                                        onRespondToFriendRequest={handleRespondToFriendRequest}
                                        onSendPlaydateRequest={handleSendPlaydateRequest}
                                     /> : <div>User not found</div>;
            case 'pet':
                return viewingPet ? <PetProfile 
                                        pet={viewingPet}
                                        currentUser={currentUser}
                                        allUsersMap={allUsersMap}
                                        allPlaydates={allPlaydates}
                                        onNavigate={navigate}
                                        onUpdatePetPrivacySettings={handleUpdatePetPrivacySettings}
                                        onAddPetPhoto={handleAddPetPhoto}
                                        onAddHealthLogEntry={handleAddHealthLogEntry}
                                        onAddPetAchievement={handleAddPetAchievement}
                                        onAddFavoriteItem={handleAddFavoriteItem}
                                        onRemovePetFriend={handleRemovePetFriend}
                                        onUpdatePetLocation={handleUpdatePetLocation}
                                     /> : <div>Pet not found</div>;
            case 'admin':
                return <AdminDashboard users={allUsers} currentUser={currentUser} onUpdateRole={handleUpdateUserRole} onUpdateStatus={handleUpdateUserStatus} />;
            case 'messages':
                 return <MessagingView 
                            currentUser={currentUser}
                            allUsers={allUsersMap}
                            messages={allMessages}
                            onSendMessage={handleSendMessage}
                            activeConversationUserId={activeConversationUserId}
                            setActiveConversationUserId={setActiveConversationUserId}
                            onNavigate={navigate}
                        />;
            case 'groups':
                return <GroupsPage
                            currentUser={currentUser}
                            allGroups={allGroups}
                            onNavigate={navigate}
                            onCreateGroup={handleCreateGroup}
                        />;
            case 'group':
                return viewingGroup ? <GroupProfilePage 
                                        group={viewingGroup}
                                        currentUser={currentUser}
                                        allUsersMap={allUsersMap}
                                        allPosts={allPosts}
                                        onNavigate={navigate}
                                        onJoinGroup={handleJoinGroup}
                                        onLeaveGroup={handleLeaveGroup}
                                        onCreatePost={handleCreatePost}
                                        onLikeFeedItem={handleLikeFeedItem}
                                     /> : <div>Group not found</div>;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-sans">
            <Header
                user={currentUser}
                allUsers={allUsersMap}
                allFriendRequests={currentUser.incomingFriendRequests}
                allPlaydates={allPlaydates.filter(p => p.toUserId === currentUser.id && p.status === 'pending')}
                messages={allMessages}
                onLogout={handleLogout}
                onRespondToFriendRequest={handleRespondToFriendRequest}
                onRespondToPlaydateRequest={handleRespondToPlaydateRequest}
                onNavigate={navigate}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8">
                <Sidebar currentUser={currentUser} currentView={currentView} onNavigate={navigate} />
                <main className="col-span-12 lg:col-span-9 xl:col-span-7 py-8">
                    {renderContent()}
                </main>
                <aside className="hidden xl:block col-span-2 py-8">
                    {/* Placeholder for widgets, trending, etc. */}
                </aside>
            </div>
        </div>
    );
};

export default App;