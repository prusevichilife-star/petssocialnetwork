
import { User, Pet, Post, ActivityFeedItem, FriendRequest, Playdate, Message, UserDatabase } from './types';

const DB_INITIALIZED_KEY = 'petsocial_db_initialized';

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

const initialUsersData: { [key: string]: Omit<User, 'id' | 'incomingFriendRequests' | 'outgoingFriendRequests' | 'likedFeedItems'> & { incomingFriendRequestIds: string[], outgoingFriendRequestIds: string[] } } = {
  'user-1': { name: 'Alice Johnson', username: 'alicej', avatarUrl: 'https://picsum.photos/seed/alice/100/100', pets: [initialPets['pet-1']], role: 'admin', status: 'active', friends: ['user-2', 'user-4'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-2': { name: 'Bob Williams', username: 'bobw', avatarUrl: 'https://picsum.photos/seed/bob/100/100', pets: [initialPets['pet-2'], initialPets['pet-3']], role: 'moderator', status: 'active', friends: ['user-1'], privacySettings: { profileBasics: 'public', pets: 'friends', activity: 'public', friends: 'friends' }, incomingFriendRequestIds: ['req-1'], outgoingFriendRequestIds: [] },
  'user-3': { name: 'Charlie Brown', username: 'charlieb', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', pets: [initialPets['pet-4']], role: 'user', status: 'active', friends: ['user-5'], privacySettings: { profileBasics: 'friends', pets: 'friends', activity: 'private', friends: 'private' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: ['req-1'] },
  'user-4': { name: 'Diana Prince', username: 'dianap', avatarUrl: 'https://picsum.photos/seed/diana/100/100', pets: [initialPets['pet-5'], initialPets['pet-6']], role: 'user', status: 'active', friends: ['user-1', 'user-6'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-5': { name: 'Ethan Hunt', username: 'ethanh', avatarUrl: 'https://picsum.photos/seed/ethan/100/100', pets: [initialPets['pet-7']], role: 'user', status: 'active', friends: ['user-3', 'user-7'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-6': { name: 'Fiona Glenanne', username: 'fionag', avatarUrl: 'https://picsum.photos/seed/fiona/100/100', pets: [initialPets['pet-8']], role: 'user', status: 'active', friends: ['user-4', 'user-8'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'friends', friends: 'friends' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-7': { name: 'George Costanza', username: 'georgec', avatarUrl: 'https://picsum.photos/seed/george/100/100', pets: [initialPets['pet-9'], initialPets['pet-10']], role: 'user', status: 'active', friends: ['user-5', 'user-9'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-8': { name: 'Hannah Montana', username: 'hannahm', avatarUrl: 'https://picsum.photos/seed/hannah/100/100', pets: [], role: 'user', status: 'suspended', friends: ['user-6'], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-9': { name: 'Indiana Jones', username: 'indianaj', avatarUrl: 'https://picsum.photos/seed/indiana/100/100', pets: [initialPets['pet-11']], role: 'user', status: 'active', friends: ['user-7'], privacySettings: { profileBasics: 'public', pets: 'friends', activity: 'friends', friends: 'friends' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-10': { name: 'Jack Sparrow', username: 'jack_sparrow', avatarUrl: 'https://picsum.photos/seed/jack/100/100', pets: [], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-11': { name: 'Kim Possible', username: 'kimp', avatarUrl: 'https://picsum.photos/seed/kim/100/100', pets: [initialPets['pet-12']], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-12': { name: 'Liz Lemon', username: 'lizl', avatarUrl: 'https://picsum.photos/seed/liz/100/100', pets: [initialPets['pet-13'], initialPets['pet-14']], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'friends', pets: 'friends', activity: 'friends', friends: 'friends' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-13': { name: 'Michael Scott', username: 'michaels', avatarUrl: 'https://picsum.photos/seed/michael/100/100', pets: [initialPets['pet-15']], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-14': { name: 'Ned Flanders', username: 'nedf', avatarUrl: 'https://picsum.photos/seed/ned/100/100', pets: [], role: 'user', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
  'user-15': { name: 'Olivia Benson', username: 'oliviab', avatarUrl: 'https://picsum.photos/seed/olivia/100/100', pets: [], role: 'moderator', status: 'active', friends: [], privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, incomingFriendRequestIds: [], outgoingFriendRequestIds: [] },
};

const initialPostsData: (Omit<Post, 'id'> & { isLikedBy?: string[] })[] = [
  { type: 'post', userId: 'user-1', petId: 'pet-1', content: 'Buddy enjoying the sunshine at the park today! ☀️🐶', date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), likeCount: 0 },
  { type: 'post', userId: 'user-2', petId: 'pet-2', content: 'Lucy loves her new scratching post! 😻', date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), likeCount: 0 },
  { type: 'post', userId: 'user-3', petId: 'pet-4', content: 'Chloe is being majestic as usual.', date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), likeCount: 1, isLikedBy: ['user-1'] },
  { type: 'post', userId: 'user-4', petId: 'pet-5', content: 'Rocky has so much energy today!', date: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), likeCount: 0 },
  { type: 'post', userId: 'user-5', petId: 'pet-7', content: 'Daisy found a new smell she is very interested in.', date: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), likeCount: 0 },
  { type: 'post', userId: 'user-6', petId: 'pet-8', content: 'Simba is just a big fluffy pillow.', date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), likeCount: 1, isLikedBy: ['user-1'] },
  { type: 'post', userId: 'user-7', petId: 'pet-9', content: 'Sadie got a fresh trim! Looking fabulous.', date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), likeCount: 0 },
  { type: 'post', userId: 'user-9', petId: 'pet-11', content: 'Zeus tried to sit on my lap. Send help.', date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), likeCount: 1, isLikedBy: ['user-1'] },
  { type: 'post', userId: 'user-13', petId: 'pet-15', content: 'Cooper is trying to herd the Roomba.', date: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), likeCount: 0 },
];

const initialActivitiesData: (Omit<ActivityFeedItem, 'id'> & { isLikedBy?: string[] })[] = [
    { type: 'activity', userId: 'user-1', petId: 'pet-1', title: 'First Swim at the Lake', date: '2024-07-20T10:00:00.000Z', description: 'He was a bit scared at first but then loved it!', category: 'Adventure', photoUrl: 'https://picsum.photos/seed/buddy-swim/400/300', likeCount: 0, },
    { type: 'activity', userId: 'user-1', petId: 'pet-1', title: 'Learned to Shake Hands', date: '2024-06-05T15:30:00.000Z', description: 'After many treats, he finally got it!', category: 'Milestone', likeCount: 0 },
    { type: 'activity', userId: 'user-4', petId: 'pet-6', title: 'Conquered the Bookshelf', date: '2024-07-19T12:00:00.000Z', description: 'Milo reached the top shelf for the first time!', category: 'Milestone', photoUrl: 'https://picsum.photos/seed/milo-climb/400/300', likeCount: 0 },
    { type: 'activity', userId: 'user-7', petId: 'pet-10', title: 'Puzzle Toy Time', date: '2024-07-18T18:00:00.000Z', description: 'Oreo solved his new puzzle toy in record time.', category: 'Playtime', likeCount: 1, isLikedBy: ['user-1'] },
    { type: 'activity', userId: 'user-11', petId: 'pet-12', title: 'First Vet Visit', date: '2024-05-15T09:30:00.000Z', description: 'Nala was so brave!', category: 'Milestone', photoUrl: 'https://picsum.photos/seed/nala-vet/400/300', likeCount: 0 },
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


export const initDB = () => {
    if (localStorage.getItem(DB_INITIALIZED_KEY)) {
        return;
    }

    const allPosts = initialPostsData.map((p, i) => ({ ...p, id: `post-${i + 1}` }));
    const allActivities = initialActivitiesData.map((a, i) => ({ ...a, id: `act-${i + 1}` }));

    Object.entries(initialUsersData).forEach(([userId, partialUser]) => {
        const userPosts = allPosts.filter(p => p.userId === userId);
        const userActivities = allActivities.filter(a => a.userId === userId);

        const likedFeedItems = [
            ...allPosts.filter(p => p.isLikedBy?.includes(userId)).map(p => p.id),
            ...allActivities.filter(a => a.isLikedBy?.includes(userId)).map(a => a.id)
        ];
        
        // set correct like counts
        userPosts.forEach(p => {
          p.likeCount = (p.isLikedBy || []).length;
          delete (p as any).isLikedBy;
        });
        userActivities.forEach(a => {
          a.likeCount = (a.isLikedBy || []).length;
          delete (a as any).isLikedBy;
        });

        const user: User = {
            id: userId,
            ...partialUser,
            incomingFriendRequests: partialUser.incomingFriendRequestIds.map(id => initialFriendRequests[id]).filter(Boolean),
            outgoingFriendRequests: partialUser.outgoingFriendRequestIds.map(id => initialFriendRequests[id]).filter(Boolean),
            likedFeedItems,
        };
        
        const userDb: UserDatabase = {
            user,
            posts: userPosts,
            activities: userActivities,
            messages: initialMessages.filter(m => m.fromUserId === userId || m.toUserId === userId),
            playdates: Object.values(initialPlaydates).filter(p => p.fromUserId === userId || p.toUserId === userId),
        };

        localStorage.setItem(userId, JSON.stringify(userDb));
    });

    localStorage.setItem(DB_INITIALIZED_KEY, 'true');
};

export const getUserData = (userId: string): UserDatabase | null => {
    const data = localStorage.getItem(userId);
    return data ? JSON.parse(data) : null;
};

export const setUserData = (userId: string, data: UserDatabase) => {
    localStorage.setItem(userId, JSON.stringify(data));
};

export const getAllUsersData = (): Record<string, UserDatabase> => {
    const allUserData: Record<string, UserDatabase> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user-')) {
            const data = getUserData(key);
            if(data) {
                allUserData[key] = data;
            }
        }
    }
    return allUserData;
}
