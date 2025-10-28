
export type Role = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type Visibility = 'public' | 'friends' | 'private';

export interface PrivacySettings {
  profileBasics: Visibility;
  pets: Visibility;
  activity: Visibility;
  friends: Visibility;
}

export interface PetPrivacySettings {
  profile: Visibility;
  playdates: 'friends' | 'private';
}

export type HealthLogEntryType = 'Vet Visit' | 'Vaccination' | 'Medication';

export interface HealthLogEntry {
  id: string;
  type: HealthLogEntryType;
  date: string; // YYYY-MM-DD
  notes: string;
}

export interface PetAchievement {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  icon: 'trophy';
}

export type FavoriteItemCategory = 'Toy' | 'Food' | 'Activity';

export interface FavoriteItem {
  id: string;
  name: string;
  category: FavoriteItemCategory;
}

export type PetActivityCategory = 'Milestone' | 'Playtime' | 'Adventure' | 'Grooming';

export interface PetActivity {
  id: string;
  title: string;
  date: string; // ISO String
  description?: string;
  photoUrl?: string;
  category: PetActivityCategory;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  avatarUrl: string;
  type: 'Dog' | 'Cat';
  birthdate: string; // YYYY-MM-DD
  bio: string;
  photos: string[];
  friends: string[]; // Pet friend IDs
  privacySettings: PetPrivacySettings;
  healthLog?: HealthLogEntry[];
  achievements?: PetAchievement[];
  favoriteItems?: FavoriteItem[];
}

export interface User {
  id:string;
  name: string;
  username: string;
  avatarUrl: string;
  pets: Pet[];
  role: Role;
  status: UserStatus;
  friends: string[];
  privacySettings: PrivacySettings;
  incomingFriendRequests: string[];
  outgoingFriendRequests: string[];
}

export interface Post {
  id: string;
  type: 'post';
  user: User;
  content: string;
  date: string; // ISO String
  likeCount: number;
  isLiked: boolean;
  pet?: Pet;
}

export interface ActivityFeedItem extends Omit<PetActivity, 'id'> {
  id: string;
  type: 'activity';
  user: User;
  pet: Pet;
  likeCount: number;
  isLiked: boolean;
}

export type FeedItem = Post | ActivityFeedItem;


export interface FriendRequest {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: 'pending';
}

export type PlaydateStatus = 'pending' | 'accepted' | 'declined';

export interface Playdate {
    id: string;
    fromPetId: string;
    toPetId: string;
    fromUserId: string;
    toUserId: string;
    status: PlaydateStatus;
    date: string; // ISO string for simplicity
    location: string;
}

export interface Message {
    id: string;
    fromUserId: string;
    toUserId: string;
    content: string;
    timestamp: string; // ISO String
    read: boolean;
}
