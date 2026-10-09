import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  IGalleryImage,
  ITimelineEvent,
  IPersonalCard,
  ILoveLetter,
  IFutureGoal,
  IPrivateNote,
  IPrivateJournal,
  ISurpriseIdea,
  ISiteSettings
} from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseStore {
  admins: Array<{
    _id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }>;
  gallery: IGalleryImage[];
  timeline: ITimelineEvent[];
  cards: IPersonalCard[];
  loveLetters: ILoveLetter[];
  futureGoals: IFutureGoal[];
  privateNotes: IPrivateNote[];
  privateJournals: IPrivateJournal[];
  surpriseIdeas: ISurpriseIdea[];
  settings: ISiteSettings;
}

let store: DatabaseStore = {
  admins: [],
  gallery: [],
  timeline: [],
  cards: [],
  loveLetters: [],
  futureGoals: [],
  privateNotes: [],
  privateJournals: [],
  surpriseIdeas: [],
  settings: {
    _id: 'default_settings',
    heroHeadline: 'Welcome to our little universe.',
    heroSubtitle: 'A tiny corner of the internet that belongs to us.',
    heroButtonText: 'Enter our story →',
    featuredImageUrl: 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg',
    featuredMemoryTitle: 'The Moment Time Stood Still',
    featuredMemorySubtitle: 'Just us, nothing else.',
    featuredMemoryText: 'Whenever we take these quick selfies, it reminds me that the best parts of life are not the loud stages—they are the quiet seconds where you lean in and just smile.',
    featuredMemoryImage: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg',
    chukkuIntro: 'The sweetest chaos, the warmest laugh, and the girl who turned my whole world upside down in the best way possible.',
    chukkuFeaturedImage: 'WhatsApp Image 2026-10-08 at 4.25.23 PM (1).jpeg',
    chukkuFeaturedQuote: 'The girl who turns ordinary days into poetry.',
    hyphaeIntro: 'The boy who looks at you like you are the only constellation in the sky. Coding late into the night just to make you smile.',
    hyphaeFeaturedImage: 'WhatsApp Image 2026-10-08 at 4.22.29 PM.jpeg',
    hyphaeFeaturedQuote: 'I found everything I ever searched for the day you looked back at me.',
    hyphaePersonalNote: 'I may not always find the perfect poetic words, but everything in this website, every line of code, every saved picture—it was all created so you know how deeply you are loved.',
    finalSurpriseTitle: 'One Last Thing…',
    finalSurpriseMessage: 'Thank you for being my home, my favorite adventure, and my safest harbor. Every second with you is a gift I will treasure for the rest of my days.',
    finalSurpriseImage: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg',
    finalSurpriseIsPrivate: false,
    musicEnabled: true,
    musicTrackTitle: 'Our Soft Melody',
    musicTrackArtist: 'Hyphae for Chukku',
    musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    volume: 0.5,
    updatedAt: new Date().toISOString()
  }
};

let isMongoConnected = false;

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load from disk if exists
export function loadDatabase(): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      store = JSON.parse(data);
      console.log('Database loaded successfully from file store.');
    } else {
      seedInitialData();
      saveDatabase();
      console.log('Database initialized with romantic Chukku & Hyphae seed data.');
    }
  } catch (err) {
    console.error('Error loading database file:', err);
    seedInitialData();
  }
}

export function saveDatabase(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

export async function connectMongoDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>')) {
    console.log('MongoDB URI not specified or contains placeholder; using high-speed local document store.');
    loadDatabase();
    return;
  }

  try {
    console.log('Attempting connection to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    isMongoConnected = true;
    console.log('Connected to MongoDB Atlas successfully!');
  } catch (err) {
    console.warn('MongoDB Atlas connection failed or timed out. Falling back to robust local persistent store.', err);
    loadDatabase();
  }
}

export function getStore(): DatabaseStore {
  return store;
}

// Helper to seed rich, beautiful data matching Chukku & Hyphae's real photographs
function seedInitialData(): void {
  const adminHashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'forever_and_always', 10);

  store.admins = [
    {
      _id: 'admin_hyphae_01',
      email: process.env.ADMIN_EMAIL || 'hyphae@chukku.world',
      password: adminHashedPassword,
      name: 'Hyphae',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Real photographs matched with authentic moments
  store.gallery = [
    {
      _id: 'gal_01',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg',
      title: 'Looking Up At You',
      caption: 'The way you look at me in this mirror makes every noise in the world fade away.',
      date: '2026-04-12',
      location: 'Our Favorite Cafe',
      category: 'Favorites',
      order: 1,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_02',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg',
      title: 'Cheek Kisses & Closed Eyes',
      caption: 'When you smile with your eyes closed, that is my entire definition of peace.',
      date: '2026-05-18',
      location: 'Quiet Afternoon',
      category: 'Us',
      order: 2,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_03',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.31 PM (2).jpeg',
      title: 'Boat Ride on Lake Pichola',
      caption: 'Soaking in the sun while paddling across the shimmering lake in Udaipur.',
      date: '2026-03-24',
      location: 'Lake Pichola, Udaipur',
      category: 'Adventures',
      order: 3,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_04',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.23 PM (1).jpeg',
      title: 'Her Special Day',
      caption: 'Dressed up, glowing with that quiet radiant smile. Pure elegance.',
      date: '2026-06-10',
      location: 'Celebration Lunch',
      category: 'Special Days',
      order: 4,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_05',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.25 PM (3).jpeg',
      title: 'Pouting in Yellow',
      caption: 'Your playful pouts are my absolute weakness and you know it.',
      date: '2026-07-04',
      location: 'Sunday Morning',
      category: 'Random Moments',
      order: 5,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_06',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.30 PM (3).jpeg',
      title: 'Oversized Hoodie Mirror Selfie',
      caption: 'You stealing my hoodies and looking ten times better in them than I ever could.',
      date: '2026-08-14',
      location: 'The Hallway',
      category: 'Us',
      order: 6,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_07',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.29 PM (1).jpeg',
      title: 'Under Fairy Lights',
      caption: 'Warm ambient glow, coffee cups, and endless conversations about our future.',
      date: '2026-09-02',
      location: 'Bistro Evening',
      category: 'Favorites',
      order: 7,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_08',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.32 PM (1).jpeg',
      title: 'Rocky Hilltop Breeze',
      caption: 'Climbing up the rocky peaks just to catch the sunset together.',
      date: '2026-03-25',
      location: 'Aravalli Hills',
      category: 'Adventures',
      order: 8,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_09',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.26 PM.jpeg',
      title: 'Late Night Screen Glow',
      caption: 'Hours fly by like minutes whenever we are talking on video calls.',
      date: '2026-02-14',
      location: 'Miles Apart, Hearts Together',
      category: 'Random Moments',
      order: 9,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // PRIVATE MEMORIES (Only visible inside Private Vault!)
    {
      _id: 'gal_priv_01',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.25 PM (1).jpeg',
      title: 'The Softest Kiss',
      caption: 'Your hand cradling my face, whispering promises that only the room could hear.',
      date: '2026-06-22',
      location: 'Our Secret Space',
      category: 'Us',
      order: 10,
      isPrivate: true,
      isPublished: false,
      privateNote: 'One of the most tender moments we ever shared. Chukku kept kissing me until I promised not to overthink.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_priv_02',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.30 PM (2).jpeg',
      title: 'Stolen Hallway Kiss',
      caption: 'Before stepping outside, pulling you close for one last lingering kiss.',
      date: '2026-08-14',
      location: 'Hallway Mirror',
      category: 'Favorites',
      order: 11,
      isPrivate: true,
      isPublished: false,
      privateNote: 'I took this right before we left for dinner. She made me swear I would not post it online. It belongs only in our vault.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'gal_priv_03',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.15 PM.jpeg',
      title: 'Rooftop Birthday Midnight',
      caption: 'Surrounded by wrapped gifts and laughing with friends, but my eyes were only scanning for you.',
      date: '2026-07-28',
      location: 'Rooftop Lounge',
      category: 'Special Days',
      order: 12,
      isPrivate: true,
      isPublished: false,
      privateNote: 'Private memory of the surprise gifts Chukku secretly coordinated with everyone.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  store.timeline = [
    {
      _id: 'time_01',
      date: 'October 2025',
      title: 'The Beginning',
      description: 'Two separate lives collided. It started with simple text exchanges that unexpectedly turned into 3 AM deep talks.',
      location: 'Online',
      quote: 'Sometimes the quietest beginnings become the loudest symphonies.',
      order: 1,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'time_02',
      date: 'November 2025',
      title: 'First Conversation That Changed Everything',
      description: 'We talked about our childhood fears, our biggest hopes, and realized we were speaking the exact same emotional language.',
      location: 'Voice Call',
      quote: 'I knew right then that you were not just someone passing through.',
      order: 2,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'time_03',
      date: 'December 2025',
      title: 'First Memory & Video Calls',
      description: 'Seeing your laugh on video for the very first time. You looked so shy, but your smile lit up my entire room.',
      location: 'Late Night Screen Glow',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.26 PM.jpeg',
      quote: 'Even through pixels, you felt like home.',
      order: 3,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'time_04',
      date: 'January 2026',
      title: 'First In-Person Meeting',
      description: 'The butterflies were wild. Seeing you walk towards me in real life—everything about you was even more radiant than I dreamed.',
      location: 'City Metro Station',
      quote: 'My heart beat so hard I thought everyone on the platform could hear it.',
      order: 4,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'time_05',
      date: 'March 2026',
      title: 'Udaipur Adventures & Lake Pichola',
      description: 'Gliding across the waters of Lake Pichola on a paddle boat, climbing up the rocky hills, laughing until our cheeks hurt.',
      location: 'Udaipur, Rajasthan',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.31 PM (2).jpeg',
      quote: 'Golden sun, cold lake water, and your hand in mine.',
      order: 5,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'time_06',
      date: 'Today & Beyond',
      title: 'What’s Next?',
      description: 'Every chapter we write is better than the last. An endless journey of little shared moments, warm teas, and lifelong dreams.',
      location: 'Everywhere With You',
      quote: 'I would choose you in every lifetime, without a pause, without a doubt.',
      order: 6,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Private Timeline item
    {
      _id: 'time_priv_01',
      date: 'Secret Date',
      title: 'The Promise We Made In Whispers',
      description: 'Late at night, when the rest of the world was asleep, we whispered what we want our house to look like one day.',
      location: 'Under the Blankets',
      quote: 'A balcony full of plants, a desk for my code, and you reading next to me.',
      order: 7,
      isPrivate: true,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  store.cards = [
    // Chukku cards
    {
      _id: 'card_chk_01',
      owner: 'chukku',
      title: 'Your Radiant Smile',
      description: 'The way your whole face crinkles when something is genuinely funny. It turns my worst days into sunny ones instantly.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (3).jpeg',
      category: 'Things I Love About You',
      order: 1,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'card_chk_02',
      owner: 'chukku',
      title: 'Your Little Habits',
      description: 'How you pull your sleeves over your hands, rest your chin on your palm, and pout when you are trying to convince me of something.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.25 PM (3).jpeg',
      category: 'Things I Love About You',
      order: 2,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'card_chk_03',
      owner: 'chukku',
      title: 'The Way You Care',
      description: 'You remember the tinniest details—whether I drank enough water, whether I took a break from my laptop, how I am feeling inside.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.32 PM.jpeg',
      category: 'Things I Love About You',
      order: 3,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'card_chk_04',
      owner: 'chukku',
      title: 'Your Cute Craziness',
      description: 'Random bursts of singing, spontaneous funny dance moves in the middle of a room, and the dramatic gasps that keep me laughing forever.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.31 PM (2).jpeg',
      category: 'Little Things',
      order: 4,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'card_chk_05',
      owner: 'chukku',
      title: 'Making Ordinary Days Magic',
      description: 'Even just eating roadside snacks or riding the metro with you feels like an indie movie scene.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.31 PM (1).jpeg',
      category: 'Little Things',
      order: 5,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },

    // Hyphae cards
    {
      _id: 'card_hyp_01',
      owner: 'hyphae',
      title: 'My Side of the Story',
      description: 'From the minute I met you, my focus shifted. I wanted to build things that protect you, make you proud, and create a future where you never have to worry.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.29 PM.jpeg',
      category: 'My Perspective',
      order: 1,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'card_hyp_02',
      owner: 'hyphae',
      title: 'Things I Want Us To Experience',
      description: 'Seeing the northern lights from a glass igloo, road trips with old playlists, slow dancing in our living room with tea brewing on the stove.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.31 PM.jpeg',
      category: 'Dreams',
      order: 2,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'card_hyp_03',
      owner: 'hyphae',
      title: 'Things I Want To Remember',
      description: 'The sound of your breathing when you fall asleep on calls. The exact warmth of your hands when it was cold in Udaipur.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg',
      category: 'Keepsakes',
      order: 3,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'card_hyp_04',
      owner: 'hyphae',
      title: 'Things I Never Say Enough',
      description: 'You are the most precious person in my life. I notice every sweet thing you do, even when I am quiet or busy. You are my priority, always.',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.25.32 PM (1).jpeg',
      category: 'Confessions',
      order: 4,
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  store.loveLetters = [
    {
      _id: 'let_pub_01',
      title: 'A Little Letter For You',
      content: `My dearest Chukku,

If anyone asked me to describe love before I met you, I would have answered with clichés and book quotes. But then you came into my life, and you gave the word a face, a laugh, and a heartbeat.

I built this little website because I wanted to give you a corner of the internet where nothing else matters except us. A world where our photos, our laughs, our late-night calls, and all the quiet moments we share can stay protected forever.

Thank you for being my patient listener, my favorite travel partner, and the person who makes me want to be the best version of myself every single morning.

Forever yours,
Hyphae`,
      date: 'October 2026',
      imageUrl: 'WhatsApp Image 2026-10-08 at 4.22.33 PM.jpeg',
      mood: 'Pure Devotion',
      isPrivate: false,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // PRIVATE LETTERS (Vault Only)
    {
      _id: 'let_priv_01',
      title: 'Things I Never Said Out Loud',
      content: `Chukku,
There are nights when you are asleep and I am still staring at the ceiling, thinking about how lucky I am. Sometimes I get scared of how deeply I care about you—because you have my entire heart in your hands. But every time you hold my hand or press your forehead against mine, all the fear washes away. I promise to always protect your gentle heart.`,
      date: 'Late Night Thought',
      mood: 'Unfiltered Heart',
      isPrivate: true,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'let_priv_02',
      title: 'A Letter for Hard Days',
      content: `Read this whenever you feel overwhelmed: You are stronger and more resilient than you give yourself credit for. And even when everything outside feels chaotic, you have a safe shelter right here in my arms. You never have to carry anything alone again.`,
      date: 'For A Rainy Day',
      mood: 'Comfort & Shelter',
      isPrivate: true,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  store.futureGoals = [
    {
      _id: 'fut_01',
      title: 'Watch the Sunrise From a Mountain Peak',
      description: 'Wrap up in thick blankets with a flask of hot tea, sitting quietly together as the first golden rays break over the clouds.',
      category: 'Sunrise',
      targetDate: '2027',
      completed: false,
      isPrivate: false,
      isPublished: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fut_02',
      title: 'International Trip to Japan in Cherry Blossom Season',
      description: 'Walking through Kyoto in spring, eating warm matcha sweets, and taking hundreds of polaroid photos under the pink sakura trees.',
      category: 'Travel',
      targetDate: 'Spring 2027',
      completed: false,
      isPrivate: false,
      isPublished: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fut_03',
      title: 'Cooking Our First Full Dinner From Scratch',
      description: 'Making fresh pasta together with romantic jazz in the background, making a huge flour mess, and laughing through it.',
      category: 'Experiences',
      targetDate: 'This Winter',
      completed: false,
      isPrivate: false,
      isPublished: true,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'fut_04',
      title: 'Our Own Cozy Library Corner',
      description: 'A cozy house with high bookshelves, big windows, and two comfy armchairs where we read together on rainy afternoons.',
      category: 'Dreams',
      targetDate: 'Future Home',
      completed: false,
      isPrivate: false,
      isPublished: true,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Private Future Plan
    {
      _id: 'fut_priv_01',
      title: 'The Secret Proposal Trip',
      description: 'A secluded cliffside or seaside cottage at sunset with handwritten letters leading up to the question.',
      category: 'Dreams',
      targetDate: 'When the time is right',
      completed: false,
      isPrivate: true,
      isPublished: false,
      order: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  store.privateNotes = [
    {
      _id: 'pnote_01',
      title: 'Things I Want To Tell Her',
      content: 'Remind her that she does not need to look perfect to be breathtaking. When she ties her hair up messily, she is at her most beautiful.',
      category: 'Daily Reminders',
      tags: ['love', 'sweet', 'reminders'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'pnote_02',
      title: 'Birthday Gift Ideas for Chukku',
      content: '1. A customized leather-bound scrapbook with our printed photos.\n2. That delicate silver bracelet she looked at for three minutes.\n3. Handwritten 50 reasons why I love her in origami stars.',
      category: 'Gift Ideas',
      tags: ['gifts', 'birthday', 'ideas'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'pnote_03',
      title: 'Things She Loves',
      content: '- Mild coffee with caramel\n- Soft hoodies that smell like comfort\n- Being hugged from behind\n- When I play with her hair until she gets sleepy',
      category: 'Observations',
      tags: ['chukku', 'habits', 'memories'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  store.privateJournals = [
    {
      _id: 'pjr_01',
      title: 'The Night I Decided To Build This World',
      content: 'It was 2 AM. I was looking through all the photos we took this year. Standard Instagram posts or cloud drives felt so cold and impersonal for what we have. She deserves an entire handcrafted digital universe. I opened VS Code and began writing the first lines for Chukku × Hyphae.',
      date: '2026-10-01',
      mood: 'Inspired & Devoted',
      tags: ['creation', 'code', 'hyphae', 'love'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'pjr_02',
      title: 'Reflections After Our Long Conversation',
      content: 'We talked for four hours about life, our families, and our hopes. Every single time we talk, I feel calmer, grounded, and certain about where I want my future to be.',
      date: '2026-09-20',
      mood: 'Peaceful',
      tags: ['heart', 'connection'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  store.surpriseIdeas = [
    {
      _id: 'surp_01',
      title: 'Secret Candlelight Rooftop Stargazing Date',
      description: 'Set up fairy lights, soft pillows, a projector screen playing our favorite comfort movie, and warm hot chocolate.',
      date: 'Next Month',
      location: 'Private Terrace',
      budget: '$150',
      checklist: [
        { id: 'c1', text: 'Order fairy lights and cozy floor cushions', done: true },
        { id: 'c2', text: 'Curate 2-hour acoustic playlist', done: true },
        { id: 'c3', text: 'Prepare mini chocolate fondue & strawberries', done: false },
        { id: 'c4', text: 'Print out 10 mini polaroids to string across the terrace', done: false }
      ],
      status: 'Planning',
      images: ['WhatsApp Image 2026-10-08 at 4.25.15 PM.jpeg'],
      notes: 'Make sure it is a clear night without rain. Keep it an absolute surprise until we take the elevator up.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'surp_02',
      title: 'Surprise Weekend Getaway to the Hills',
      description: 'Pack her bags secretly with her sister’s help, pick her up on a Friday afternoon, and drive straight to a quiet hill cottage.',
      date: 'Winter 2026',
      location: 'Mountain Valley Cottage',
      budget: '$400',
      checklist: [
        { id: 'c21', text: 'Confirm cottage booking with fireplace', done: false },
        { id: 'c22', text: 'Check weather forecast for misty morning vibes', done: false },
        { id: 'c23', text: 'Secretly pack warm jackets and her favorite snacks', done: false }
      ],
      status: 'Idea',
      images: [],
      notes: 'She mentioned wanting to see misty mountains with pine trees.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
