export type Role = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type Visibility = 'public' | 'friends' | 'private';

export interface PrivacySettings {
  profileBasics: Visibility;
  pets: Visibility;
  activity: Visibility;
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
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  pets: Pet[];
  role: Role;
  status: UserStatus;
  friends: string[];
  privacySettings: PrivacySettings;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likeCount: number;
  isLiked: boolean;
  pet?: Pet;
}