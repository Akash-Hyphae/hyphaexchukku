import mongoose, { Schema } from 'mongoose';

export const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Hyphae' },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const GalleryImageSchema = new Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String },
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  date: { type: String, default: '' },
  location: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['All', 'Us', 'Favorites', 'Adventures', 'Random Moments', 'Special Days'],
    default: 'Us'
  },
  order: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  privateNote: { type: String, default: '' }
}, { timestamps: true });

export const TimelineEventSchema = new Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: '' },
  imageUrl: { type: String },
  publicId: { type: String },
  quote: { type: String },
  order: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export const PersonalCardSchema = new Schema({
  owner: { type: String, enum: ['chukku', 'hyphae'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  publicId: { type: String },
  category: { type: String, default: 'Memory' },
  order: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export const LoveLetterSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  imageUrl: { type: String },
  mood: { type: String, default: 'Endless Love' },
  isPrivate: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export const FutureGoalSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Travel', 'Sunrise', 'Experiences', 'Moments', 'Dreams'], default: 'Experiences' },
  targetDate: { type: String },
  completed: { type: Boolean, default: false },
  imageUrl: { type: String },
  isPrivate: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const PrivateNoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Random thoughts' },
  tags: [{ type: String }]
}, { timestamps: true });

export const PrivateJournalSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  mood: { type: String, default: 'Reflective' },
  tags: [{ type: String }]
}, { timestamps: true });

export const SurpriseIdeaSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String },
  location: { type: String },
  budget: { type: String },
  checklist: [{
    id: { type: String },
    text: { type: String },
    done: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['Idea', 'Planning', 'Ready', 'Completed'], default: 'Idea' },
  images: [{ type: String }],
  notes: { type: String }
}, { timestamps: true });

export const SiteSettingsSchema = new Schema({
  heroHeadline: { type: String, default: 'Welcome to our little universe.' },
  heroSubtitle: { type: String, default: 'A tiny corner of the internet that belongs to us.' },
  heroButtonText: { type: String, default: 'Enter our story →' },
  featuredImageUrl: { type: String, default: '' },
  chukkuIntro: { type: String, default: 'The girl who turns ordinary days into poetry.' },
  hyphaeIntro: { type: String, default: 'Just a guy who fell head over heels and built a world to prove it.' },
  finalSurpriseTitle: { type: String, default: 'One Last Thing…' },
  finalSurpriseMessage: { type: String, default: 'No matter where life takes us, remember this: in every universe, it was always going to be you.' },
  finalSurpriseImage: { type: String, default: '' },
  finalSurpriseIsPrivate: { type: Boolean, default: false },
  musicEnabled: { type: Boolean, default: true },
  musicTrackTitle: { type: String, default: 'Golden Hour Memories' },
  musicTrackArtist: { type: String, default: 'Chukku & Hyphae' },
  musicUrl: { type: String, default: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
  volume: { type: Number, default: 0.6 }
}, { timestamps: true });
