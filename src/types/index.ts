export type ContentVisibility = 'public' | 'private' | 'draft';

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  publicId?: string;
  title: string;
  caption: string;
  date: string;
  location: string;
  category: 'All' | 'Us' | 'Favorites' | 'Adventures' | 'Random Moments' | 'Special Days';
  order: number;
  isPrivate: boolean;
  isPublished: boolean;
  privateNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimelineEvent {
  _id: string;
  date: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  quote?: string;
  order: number;
  isPrivate: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalCardItem {
  _id: string;
  owner: 'chukku' | 'hyphae';
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  order: number;
  isPrivate: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoveLetterItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  mood?: string;
  isPrivate: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FutureGoalItem {
  _id: string;
  title: string;
  description: string;
  category: 'Travel' | 'Sunrise' | 'Experiences' | 'Moments' | 'Dreams';
  targetDate?: string;
  completed: boolean;
  imageUrl?: string;
  isPrivate: boolean;
  isPublished: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrivateNoteItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PrivateJournalItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SurpriseIdeaItem {
  _id: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  budget?: string;
  checklist: { id: string; text: string; done: boolean }[];
  status: 'Idea' | 'Planning' | 'Ready' | 'Completed';
  images: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  _id?: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroButtonText: string;
  featuredImageUrl: string;
  chukkuIntro: string;
  hyphaeIntro: string;
  finalSurpriseTitle: string;
  finalSurpriseMessage: string;
  finalSurpriseImage: string;
  finalSurpriseIsPrivate: boolean;
  musicEnabled: boolean;
  musicTrackTitle: string;
  musicTrackArtist: string;
  musicUrl: string;
  volume: number;
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
