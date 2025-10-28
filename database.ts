import { User, Pet, Post, ActivityFeedItem, FriendRequest, Playdate, Message, Role, UserStatus, PrivacySettings, PetPrivacySettings, HealthLogEntry, PetAchievement, FavoriteItem, Visibility, Group, GroupMember } from './types';

// This is a browser-only library, so we need to tell TypeScript it's available on the window
declare const initSqlJs: (config?: any) => Promise<any>;

const DB_NAME = 'petsocial.db';
const STORE_NAME = 'db_store';

// --- INITIAL SEED DATA ---
const allInitialUsers: Omit<User, 'pets'|'friends'|'incomingFriendRequests'|'outgoingFriendRequests'|'likedFeedItems'>[] = [
    { id: 'user-1', name: 'Alice Johnson', username: 'alicej', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', role: 'admin', status: 'active', privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, bio: 'Lover of all animals. Admin of PetSocial. My golden retriever Buddy is my world!' },
    { id: 'user-2', name: 'Bob Williams', username: 'bobw', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', role: 'moderator', status: 'active', privacySettings: { profileBasics: 'public', pets: 'friends', activity: 'public', friends: 'friends' }, bio: 'Cat dad to Lucy and Max. Tech enthusiast and moderator here to help.' },
    { id: 'user-3', name: 'Charlie Brown', username: 'charlieb', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', role: 'user', status: 'active', privacySettings: { profileBasics: 'friends', pets: 'friends', activity: 'private', friends: 'private' }, bio: 'Just a guy and his cat, Chloe. Enjoying the quiet life.' },
    { id: 'user-4', name: 'Diana Miller', username: 'dianam', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', role: 'user', status: 'active', privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'friends' }, bio: 'Proud owner of Rocky the boxer and Misty the Maine Coon. Always up for an adventure.' },
    { id: 'user-5', name: 'Ethan Davis', username: 'ethand', avatarUrl: 'https://i.pravatar.cc/150?u=user-5', role: 'user', status: 'suspended', privacySettings: { profileBasics: 'public', pets: 'public', activity: 'public', friends: 'public' }, bio: 'Trying to be a better person.' },
];

const allInitialPets = [
    { id: 'pet-1', ownerId: 'user-1', name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', avatarUrl: 'https://placedog.net/500/500?id=1', birthdate: '2018-05-12', bio: 'Loves fetch and long walks at the beach. A bit of a goofball but has a heart of gold. His favorite toy is a squeaky hedgehog.', photos: ['https://placedog.net/600/400?id=1', 'https://placedog.net/600/400?id=2'], friends: ['pet-2', 'pet-5'], privacySettings: { profile: 'public', playdates: 'friends' }, location: 'Seaside Park' },
    { id: 'pet-2', ownerId: 'user-2', name: 'Lucy', type: 'Cat', breed: 'Siamese', avatarUrl: 'https://placekitten.com/500/500?image=1', birthdate: '2020-09-20', bio: 'A very vocal and curious cat. Enjoys sunbathing and judging everyone from a distance. Will do anything for a treat.', photos: ['https://placekitten.com/600/400?image=2'], friends: ['pet-1'], privacySettings: { profile: 'friends', playdates: 'friends' }, location: 'The Sunny Spot' },
    { id: 'pet-3', ownerId: 'user-2', name: 'Max', type: 'Dog', breed: 'German Shepherd', avatarUrl: 'https://placedog.net/500/500?id=3', birthdate: '2017-02-01', bio: 'Loyal and protective. Loves his family and is a great running partner.', photos: [], privacySettings: { profile: 'friends', playdates: 'private' } },
    { id: 'pet-4', ownerId: 'user-3', name: 'Chloe', type: 'Cat', breed: 'Persian', avatarUrl: 'https://placekitten.com/500/500?image=4', birthdate: '2021-11-30', bio: 'Loves being pampered and brushed. A true princess.', photos: ['https://placekitten.com/600/400?image=5'], friends: ['pet-7'], privacySettings: { profile: 'private', playdates: 'private' } },
    { id: 'pet-5', ownerId: 'user-4', name: 'Rocky', type: 'Dog', breed: 'Boxer', avatarUrl: 'https://placedog.net/500/500?id=5', birthdate: '2019-03-15', bio: 'Full of energy! Loves to play tug-of-war.', photos: [], friends: ['pet-1'], privacySettings: { profile: 'public', playdates: 'friends' }, location: 'Downtown Dog Run' },
    { id: 'pet-6', ownerId: 'user-4', name: 'Misty', type: 'Cat', breed: 'Maine Coon', avatarUrl: 'https://placekitten.com/500/500?image=6', birthdate: '2016-07-22', bio: 'A gentle giant. Very fluffy and loves to cuddle.', photos: [], friends: [], privacySettings: { profile: 'public', playdates: 'friends' } },
    { id: 'pet-7', ownerId: 'user-1', name: 'Gizmo', type: 'Dog', breed: 'Pug', avatarUrl: 'https://placedog.net/500/500?id=7', birthdate: '2022-01-10', bio: 'A bundle of snorts and wrinkles.', photos: [], friends: ['pet-4'], privacySettings: { profile: 'public', playdates: 'friends' }, location: 'Alice\'s Backyard' },
];

const initialFriendships = [ {u1: 'user-1', u2: 'user-2'}, {u1: 'user-1', u2: 'user-4'} ];
const initialPosts: (Omit<Post, 'type'> & {type: 'post'})[] = [
  { id: 'post-1', type: 'post', userId: 'user-1', petId: 'pet-1', content: 'Buddy enjoying the sunshine at the park today! ☀️🐶 @bobw you should bring Lucy next time!', date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), likeCount: 1 },
  { id: 'post-2', type: 'post', userId: 'user-1', groupId: 'group-1', content: 'Does anyone have recommendations for durable chew toys for a Golden? Buddy destroys everything!', date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), likeCount: 0 },
];
const initialActivities = [
    { id: 'act-1', type: 'activity', userId: 'user-1', petId: 'pet-1', title: 'First Swim at the Lake', date: '2024-07-20T10:00:00.000Z', description: 'He was a bit scared at first but then loved it!', category: 'Adventure', photoUrl: 'https://placedog.net/600/400?id=10', likeCount: 2 },
];
const initialLikes = [ {userId: 'user-2', itemId: 'post-1'}, {userId: 'user-1', itemId: 'act-1'}, {userId: 'user-2', itemId: 'act-1'} ];
const initialFriendRequests = [ { id: 'req-1', fromUserId: 'user-3', toUserId: 'user-2', status: 'pending' } ];
const initialPlaydates = [ { id: 'pd-1', fromPetId: 'pet-1', fromUserId: 'user-1', toPetId: 'pet-4', toUserId: 'user-3', status: 'pending', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Virtual Park' } ];
const initialMessages = [
    { id: 'msg-1', fromUserId: 'user-2', toUserId: 'user-1', content: 'Hey Alice! How is Buddy doing?', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), read: false },
    { id: 'msg-2', fromUserId: 'user-1', toUserId: 'user-2', content: "He's great! We went to the park today.", timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), read: true },
];
const initialGroups = [
    { id: 'group-1', name: 'Golden Retriever Fans', description: 'A place for all Golden Retriever lovers to share photos and stories.', avatarUrl: 'https://api.dicebear.com/8.x/identicon/svg?seed=GoldenRetrieverFans', ownerId: 'user-1', visibility: 'public' },
    { id: 'group-2', name: 'NYC Cat Lovers (Private)', description: 'A private group for cat owners in New York City.', avatarUrl: 'https://api.dicebear.com/8.x/identicon/svg?seed=NYCCatLovers', ownerId: 'user-2', visibility: 'private' },
];
const initialGroupMembers = [
    { groupId: 'group-1', userId: 'user-1', role: 'admin' },
    { groupId: 'group-1', userId: 'user-4', role: 'member' },
    { groupId: 'group-2', userId: 'user-2', role: 'admin' },
];


let db: any;

// --- IndexedDB Persistence ---
function openIndexDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onerror = () => reject("Error opening IndexedDB");
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as any).result;
            db.createObjectStore(STORE_NAME);
        };
    });
}

async function saveDbToIndexedDB() {
    if (!db) return;
    const data = db.export();
    const idb = await openIndexDB();
    const transaction = idb.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(data, 'db_file');
}

async function loadDbFromIndexedDB(): Promise<Uint8Array | null> {
    const idb = await openIndexDB();
    const transaction = idb.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('db_file');
    return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
    });
}


// --- Database Initialization ---
export const initDB = async () => {
    if (db) return;
    try {
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}` });
        const savedDb = await loadDbFromIndexedDB();
        if (savedDb) {
            db = new SQL.Database(savedDb);
        } else {
            db = new SQL.Database();
            createSchema();
            seedData();
            await saveDbToIndexedDB();
        }
    } catch (err) {
        console.error("Failed to initialize database:", err);
        throw err;
    }
};

function createSchema() {
    db.run(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY, name TEXT, username TEXT, avatarUrl TEXT, role TEXT, status TEXT, privacySettings TEXT, bio TEXT
        );
        CREATE TABLE pets (
            id TEXT PRIMARY KEY, ownerId TEXT, name TEXT, breed TEXT, avatarUrl TEXT, type TEXT, birthdate TEXT, bio TEXT, photos TEXT, privacySettings TEXT, healthLog TEXT, achievements TEXT, favoriteItems TEXT, location TEXT
        );
        CREATE TABLE friendships (userId1 TEXT, userId2 TEXT, PRIMARY KEY (userId1, userId2));
        CREATE TABLE pet_friends (petId1 TEXT, petId2 TEXT, PRIMARY KEY (petId1, petId2));
        CREATE TABLE posts (id TEXT PRIMARY KEY, userId TEXT, petId TEXT, content TEXT, date TEXT, likeCount INTEGER, groupId TEXT);
        CREATE TABLE activities (id TEXT PRIMARY KEY, userId TEXT, petId TEXT, title TEXT, date TEXT, description TEXT, photoUrl TEXT, category TEXT, likeCount INTEGER);
        CREATE TABLE likes (userId TEXT, itemId TEXT, PRIMARY KEY (userId, itemId));
        CREATE TABLE friend_requests (id TEXT PRIMARY KEY, fromUserId TEXT, toUserId TEXT, status TEXT);
        CREATE TABLE playdates (id TEXT PRIMARY KEY, fromPetId TEXT, toPetId TEXT, fromUserId TEXT, toUserId TEXT, status TEXT, date TEXT, location TEXT);
        CREATE TABLE messages (id TEXT PRIMARY KEY, fromUserId TEXT, toUserId TEXT, content TEXT, timestamp TEXT, read INTEGER);
        CREATE TABLE groups (id TEXT PRIMARY KEY, name TEXT, description TEXT, avatarUrl TEXT, ownerId TEXT, visibility TEXT);
        CREATE TABLE group_members (groupId TEXT, userId TEXT, role TEXT, PRIMARY KEY (groupId, userId));
    `);
}

function seedData() {
    allInitialUsers.forEach(user => {
        db.run("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [user.id, user.name, user.username, user.avatarUrl, user.role, user.status, JSON.stringify(user.privacySettings), user.bio]);
    });
    allInitialPets.forEach((pet: any) => {
        db.run("INSERT INTO pets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [pet.id, pet.ownerId, pet.name, pet.breed, pet.avatarUrl, pet.type, pet.birthdate, pet.bio, JSON.stringify(pet.photos), JSON.stringify(pet.privacySettings), '[]', '[]', '[]', pet.location || null]);
        pet.friends.forEach((friendId: string) => {
            const sortedIds = [pet.id, friendId].sort();
            db.run("INSERT OR IGNORE INTO pet_friends VALUES (?, ?)", sortedIds);
        });
    });
    initialFriendships.forEach(f => {
        const sortedIds = [f.u1, f.u2].sort();
        db.run("INSERT INTO friendships VALUES (?, ?)", sortedIds);
    });
    initialPosts.forEach(p => db.run("INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)", [p.id, p.userId, p.petId, p.content, p.date, p.likeCount, p.groupId || null]));
    initialActivities.forEach(a => db.run("INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [a.id, a.userId, a.petId, a.title, a.date, a.description, a.photoUrl, a.category, a.likeCount]));
    initialLikes.forEach(l => db.run("INSERT INTO likes VALUES (?, ?)", [l.userId, l.itemId]));
    initialFriendRequests.forEach(r => db.run("INSERT INTO friend_requests VALUES (?, ?, ?, ?)", [r.id, r.fromUserId, r.toUserId, r.status]));
    initialPlaydates.forEach(p => db.run("INSERT INTO playdates VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [p.id, p.fromPetId, p.toPetId, p.fromUserId, p.toUserId, p.status, p.date, p.location]));
    initialMessages.forEach(m => db.run("INSERT INTO messages VALUES (?, ?, ?, ?, ?, ?)", [m.id, m.fromUserId, m.toUserId, m.content, m.timestamp, m.read ? 1 : 0]));
    initialGroups.forEach(g => db.run("INSERT INTO groups VALUES (?, ?, ?, ?, ?, ?)", [g.id, g.name, g.description, g.avatarUrl, g.ownerId, g.visibility]));
    initialGroupMembers.forEach(m => db.run("INSERT INTO group_members VALUES (?, ?, ?)", [m.groupId, m.userId, m.role]));
}


// --- Data Access Functions ---

const rowToUser = (row: any[], allPets: Pet[], friends: string[], incomingFR: FriendRequest[], outgoingFR: FriendRequest[], likes: string[]): User => ({
    id: row[0], name: row[1], username: row[2], avatarUrl: row[3], role: row[4], status: row[5], privacySettings: JSON.parse(row[6]),
    bio: row[7],
    pets: allPets.filter(p => (p as any).ownerId === row[0]),
    friends, incomingFriendRequests: incomingFR, outgoingFriendRequests: outgoingFR, likedFeedItems: likes,
});

const rowToPet = (row: any[]): Pet & {ownerId: string} => ({
    id: row[0], ownerId: row[1], name: row[2], breed: row[3], avatarUrl: row[4], type: row[5], birthdate: row[6], bio: row[7], photos: JSON.parse(row[8]), privacySettings: JSON.parse(row[9]), healthLog: JSON.parse(row[10]), achievements: JSON.parse(row[11]), favoriteItems: JSON.parse(row[12]), location: row[13], friends: []
});

function execAndMap<T>(sql: string, mapper: (row: any[]) => T): T[] {
    const res = db.exec(sql);
    if (!res || res.length === 0 || !res[0].values) return [];
    return res[0].values.map(mapper);
}

export async function getAllData() {
    if (!db) {
      throw new Error("Database not initialized. Call initDB() first.");
    }
    const usersData = db.exec("SELECT * FROM users")[0].values;
    const petsData = execAndMap("SELECT * FROM pets", rowToPet);
    const friendships = db.exec("SELECT * FROM friendships")[0].values;
    const petFriends = db.exec("SELECT * FROM pet_friends")[0].values;
    const friendRequests = execAndMap("SELECT * FROM friend_requests", r => ({id: r[0], fromUserId: r[1], toUserId: r[2], status: r[3]} as FriendRequest));
    const likes = db.exec("SELECT * FROM likes")[0].values;

    petsData.forEach(pet => {
        pet.friends = petFriends.filter(pf => pf[0] === pet.id || pf[1] === pet.id).map(pf => pf[0] === pet.id ? pf[1] : pf[0]);
    });

    const users: User[] = usersData.map(u => {
        const userId = u[0];
        const userFriends = friendships.filter(f => f[0] === userId || f[1] === userId).map(f => f[0] === userId ? f[1] : f[0]);
        const incoming = friendRequests.filter(fr => fr.toUserId === userId);
        const outgoing = friendRequests.filter(fr => fr.fromUserId === userId);
        const userLikes = likes.filter(l => l[0] === userId).map(l => l[1]);
        return rowToUser(u, petsData, userFriends, incoming, outgoing, userLikes);
    });

    const groupsData = execAndMap("SELECT * FROM groups", r => ({ id: r[0], name: r[1], description: r[2], avatarUrl: r[3], ownerId: r[4], visibility: r[5], members: [] }) as Group);
    const groupMembersData = execAndMap("SELECT * FROM group_members", r => ({ groupId: r[0], userId: r[1], role: r[2] }) as {groupId: string} & GroupMember);

    groupsData.forEach(group => {
        group.members = groupMembersData.filter(m => m.groupId === group.id).map(m => ({userId: m.userId, role: m.role}));
    });

    return {
        users,
        groups: groupsData,
        posts: execAndMap("SELECT * FROM posts", r => ({ id: r[0], userId: r[1], petId: r[2], content: r[3], date: r[4], likeCount: r[5], groupId: r[6], type: 'post' }) as Post),
        activities: execAndMap("SELECT * FROM activities", r => ({ id: r[0], userId: r[1], petId: r[2], title: r[3], date: r[4], description: r[5], photoUrl: r[6], category: r[7], likeCount: r[8], type: 'activity' }) as ActivityFeedItem),
        playdates: execAndMap("SELECT * FROM playdates", r => ({ id: r[0], fromPetId: r[1], toPetId: r[2], fromUserId: r[3], toUserId: r[4], status: r[5], date: r[6], location: r[7] }) as Playdate),
        messages: execAndMap("SELECT * FROM messages", r => ({ id: r[0], fromUserId: r[1], toUserId: r[2], content: r[3], timestamp: r[4], read: !!r[5] }) as Message),
    };
}

// --- Mutations ---
export async function createPost(userId: string, content: string, petId?: string, groupId?: string) {
    db.run("INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?, ?)", [`post-${Date.now()}`, userId, petId || null, content, new Date().toISOString(), 0, groupId || null]);
    await saveDbToIndexedDB();
}

export async function createActivity(userId: string, petId: string, activity: Omit<ActivityFeedItem, 'id'|'type'|'userId'|'petId'|'likeCount'>) {
    db.run("INSERT INTO activities VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [`act-${Date.now()}`, userId, petId, activity.title, activity.date, activity.description, activity.photoUrl, activity.category, 0]);
    await saveDbToIndexedDB();
}

export async function likeFeedItem(userId: string, itemId: string) {
    const isLikedResult = db.exec(`SELECT * FROM likes WHERE userId = '${userId}' AND itemId = '${itemId}'`);
    const isLiked = isLikedResult && isLikedResult.length > 0 && isLikedResult[0].values.length > 0;
    
    const tableName = itemId.startsWith('post') ? 'posts' : 'activities';
    if (isLiked) {
        db.run(`DELETE FROM likes WHERE userId = ? AND itemId = ?`, [userId, itemId]);
        db.run(`UPDATE ${tableName} SET likeCount = likeCount - 1 WHERE id = ?`, [itemId]);
    } else {
        db.run(`INSERT INTO likes VALUES (?, ?)`, [userId, itemId]);
        db.run(`UPDATE ${tableName} SET likeCount = likeCount + 1 WHERE id = ?`, [itemId]);
    }
    await saveDbToIndexedDB();
}

export async function updateUserRole(userId: string, role: Role) {
    db.run("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
    await saveDbToIndexedDB();
}

export async function updateUserStatus(userId: string, status: UserStatus) {
    db.run("UPDATE users SET status = ? WHERE id = ?", [status, userId]);
    await saveDbToIndexedDB();
}

export async function updatePrivacySettings(userId: string, section: keyof PrivacySettings, visibility: Visibility) {
    const res = db.exec(`SELECT privacySettings FROM users WHERE id = '${userId}'`)[0].values[0][0];
    const settings = JSON.parse(res);
    settings[section] = visibility;
    db.run("UPDATE users SET privacySettings = ? WHERE id = ?", [JSON.stringify(settings), userId]);
    await saveDbToIndexedDB();
}

export async function updatePetPrivacySettings(petId: string, section: keyof PetPrivacySettings, visibility: string) {
    const res = db.exec(`SELECT privacySettings FROM pets WHERE id = '${petId}'`)[0].values[0][0];
    const settings = JSON.parse(res);
    settings[section] = visibility;
    db.run("UPDATE pets SET privacySettings = ? WHERE id = ?", [JSON.stringify(settings), petId]);
    await saveDbToIndexedDB();
}

export async function updatePetLocation(petId: string, location: string) {
    db.run("UPDATE pets SET location = ? WHERE id = ?", [location, petId]);
    await saveDbToIndexedDB();
}

async function updatePetJsonField(petId: string, field: 'photos' | 'healthLog' | 'achievements' | 'favoriteItems', updateFn: (data: any[]) => any[]) {
    const res = db.exec(`SELECT ${field} FROM pets WHERE id = '${petId}'`)[0].values[0][0];
    const currentData = JSON.parse(res) || [];
    const newData = updateFn(currentData);
    db.run(`UPDATE pets SET ${field} = ? WHERE id = ?`, [JSON.stringify(newData), petId]);
    await saveDbToIndexedDB();
}
export const addPetPhoto = async (petId: string, photoUrl: string) => updatePetJsonField(petId, 'photos', (p) => [...p, photoUrl]);
export const addHealthLogEntry = async (petId: string, entry: Omit<HealthLogEntry, 'id'>) => updatePetJsonField(petId, 'healthLog', (hl) => [...hl, {...entry, id: `hl-${Date.now()}`}]);
export const addPetAchievement = async (petId: string, ach: Omit<PetAchievement, 'id'>) => updatePetJsonField(petId, 'achievements', (a) => [...a, {...ach, id: `ach-${Date.now()}`}]);
export const addFavoriteItem = async (petId: string, item: Omit<FavoriteItem, 'id'>) => updatePetJsonField(petId, 'favoriteItems', (fi) => [...fi, {...item, id: `fav-${Date.now()}`}]);


export async function sendFriendRequest(fromUserId: string, toUserId: string) {
    db.run("INSERT INTO friend_requests VALUES (?, ?, ?, ?)", [`req-${Date.now()}`, fromUserId, toUserId, 'pending']);
    await saveDbToIndexedDB();
}

export async function respondToFriendRequest(requestId: string, accepted: boolean) {
    const req = db.exec(`SELECT fromUserId, toUserId FROM friend_requests WHERE id = '${requestId}'`)[0].values[0];
    const [fromUserId, toUserId] = req;
    db.run("DELETE FROM friend_requests WHERE id = ?", [requestId]);
    if (accepted) {
        const sortedIds = [fromUserId, toUserId].sort();
        db.run("INSERT OR IGNORE INTO friendships VALUES (?, ?)", sortedIds);
    }
    await saveDbToIndexedDB();
}

export async function sendPlaydateRequest(fromUserId: string, fromPetId: string, toUserId: string, toPetId: string, date: string, location: string) {
    db.run("INSERT INTO playdates VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [`pd-${Date.now()}`, fromPetId, toPetId, fromUserId, toUserId, 'pending', date, location]);
    await saveDbToIndexedDB();
}

export async function respondToPlaydateRequest(playdateId: string, accepted: boolean) {
    const newStatus = accepted ? 'accepted' : 'declined';
    db.run("UPDATE playdates SET status = ? WHERE id = ?", [newStatus, playdateId]);
    if (accepted) {
        const pd = db.exec(`SELECT fromPetId, toPetId FROM playdates WHERE id = '${playdateId}'`)[0].values[0];
        const [pet1, pet2] = [pd[0], pd[1]].sort();
        db.run("INSERT OR IGNORE INTO pet_friends VALUES (?, ?)", [pet1, pet2]);
    }
    await saveDbToIndexedDB();
}

export async function removePetFriend(petId: string, friendId: string) {
    const sortedIds = [petId, friendId].sort();
    db.run("DELETE FROM pet_friends WHERE petId1 = ? AND petId2 = ?", sortedIds);
    await saveDbToIndexedDB();
}

export async function sendMessage(fromUserId: string, toUserId: string, content: string) {
    db.run("INSERT INTO messages VALUES (?, ?, ?, ?, ?, ?)", [`msg-${Date.now()}`, fromUserId, toUserId, content, new Date().toISOString(), 0]);
    await saveDbToIndexedDB();
}

export async function createGroup(ownerId: string, name: string, description: string, visibility: 'public' | 'private') {
    const groupId = `group-${Date.now()}`;
    const avatarUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${name.replace(/\s/g, '')}`;
    db.run("INSERT INTO groups VALUES (?, ?, ?, ?, ?, ?)", [groupId, name, description, avatarUrl, ownerId, visibility]);
    db.run("INSERT INTO group_members VALUES (?, ?, ?)", [groupId, ownerId, 'admin']);
    await saveDbToIndexedDB();
}

export async function joinGroup(userId: string, groupId: string) {
    db.run("INSERT OR IGNORE INTO group_members VALUES (?, ?, ?)", [groupId, userId, 'member']);
    await saveDbToIndexedDB();
}

export async function leaveGroup(userId: string, groupId: string) {
    db.run("DELETE FROM group_members WHERE groupId = ? AND userId = ?", [groupId, userId]);
    await saveDbToIndexedDB();
}