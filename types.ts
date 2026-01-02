
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export type MediaType = 'image' | 'video';

export interface Post {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: MediaType;
  caption: string;
  likes: number;
  likedByCurrentUser: boolean;
  comments: Comment[];
  timestamp: number;
  location?: string;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  isViewed: boolean;
}

export enum View {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  CREATE = 'CREATE',
  REELS = 'REELS',
  PROFILE = 'PROFILE'
}
