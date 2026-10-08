import { Response } from 'express';
import { getStore, saveDatabase } from '../config/db.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { IGalleryImage, ITimelineEvent, IPersonalCard, ILoveLetter, IFutureGoal } from '../types/index.ts';

// Helper for generating IDs
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// --- DASHBOARD OVERVIEW ---
export function getDashboardStats(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();

  const publicPhotos = store.gallery.filter(i => !i.isPrivate && i.isPublished).length;
  const privatePhotos = store.gallery.filter(i => i.isPrivate).length;
  const draftPhotos = store.gallery.filter(i => !i.isPrivate && !i.isPublished).length;

  const publicTimeline = store.timeline.filter(t => !t.isPrivate && t.isPublished).length;
  const chukkuCards = store.cards.filter(c => c.owner === 'chukku').length;
  const hyphaeCards = store.cards.filter(c => c.owner === 'hyphae').length;
  
  const privateNotesCount = store.privateNotes.length;
  const privateJournalsCount = store.privateJournals.length;
  const surpriseIdeasCount = store.surpriseIdeas.length;
  const privateLettersCount = store.loveLetters.filter(l => l.isPrivate).length;

  res.json({
    success: true,
    data: {
      public: {
        galleryTotal: store.gallery.length,
        publicPhotos,
        draftPhotos,
        timelineEvents: publicTimeline,
        chukkuCards,
        hyphaeCards,
        futureGoals: store.futureGoals.filter(f => !f.isPrivate && f.isPublished).length
      },
      privateVault: {
        privatePhotos,
        privateNotes: privateNotesCount,
        privateJournals: privateJournalsCount,
        surpriseIdeas: surpriseIdeasCount,
        privateLetters: privateLettersCount
      }
    }
  });
}

// --- GALLERY CRUD ---
export function getAdminGallery(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({ success: true, data: store.gallery.sort((a, b) => a.order - b.order) });
}

export function createGalleryImage(req: AuthenticatedRequest, res: Response): void {
  const { imageUrl, title, caption, date, location, category, order, isPrivate, isPublished, privateNote, publicId } = req.body;
  if (!imageUrl || !title) {
    res.status(400).json({ success: false, error: 'Image URL and Title are required.' });
    return;
  }

  const store = getStore();
  const newImage: IGalleryImage = {
    _id: generateId('gal'),
    imageUrl,
    publicId,
    title,
    caption: caption || '',
    date: date || new Date().toISOString().split('T')[0],
    location: location || '',
    category: category || 'Us',
    order: Number(order) || store.gallery.length + 1,
    isPrivate: Boolean(isPrivate),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : !isPrivate,
    privateNote: privateNote || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.gallery.push(newImage);
  saveDatabase();
  res.status(201).json({ success: true, data: newImage });
}

export function updateGalleryImage(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.gallery.findIndex(g => g._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Gallery image not found.' });
    return;
  }

  const existing = store.gallery[index];
  const updated: IGalleryImage = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  // If set to private, automatically unpublish from public view
  if (updated.isPrivate) {
    updated.isPublished = false;
  }

  store.gallery[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deleteGalleryImage(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const initialLength = store.gallery.length;
  store.gallery = store.gallery.filter(g => g._id !== id);

  if (store.gallery.length === initialLength) {
    res.status(404).json({ success: false, error: 'Gallery image not found.' });
    return;
  }

  saveDatabase();
  res.json({ success: true, message: 'Image deleted successfully.' });
}

// --- TIMELINE CRUD ---
export function getAdminTimeline(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({ success: true, data: store.timeline.sort((a, b) => a.order - b.order) });
}

export function createTimelineEvent(req: AuthenticatedRequest, res: Response): void {
  const { date, title, description, location, imageUrl, quote, order, isPrivate, isPublished } = req.body;
  if (!date || !title || !description) {
    res.status(400).json({ success: false, error: 'Date, title, and description are required.' });
    return;
  }

  const store = getStore();
  const newEvent: ITimelineEvent = {
    _id: generateId('time'),
    date,
    title,
    description,
    location: location || '',
    imageUrl,
    quote,
    order: Number(order) || store.timeline.length + 1,
    isPrivate: Boolean(isPrivate),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : !isPrivate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.timeline.push(newEvent);
  saveDatabase();
  res.status(201).json({ success: true, data: newEvent });
}

export function updateTimelineEvent(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.timeline.findIndex(t => t._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Timeline event not found.' });
    return;
  }

  const existing = store.timeline[index];
  const updated: ITimelineEvent = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  if (updated.isPrivate) {
    updated.isPublished = false;
  }

  store.timeline[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deleteTimelineEvent(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  store.timeline = store.timeline.filter(t => t._id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Timeline event deleted.' });
}

// --- PERSONAL CARDS CRUD (CHUKKU & HYPHAE) ---
export function getAdminCards(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({ success: true, data: store.cards.sort((a, b) => a.order - b.order) });
}

export function createPersonalCard(req: AuthenticatedRequest, res: Response): void {
  const { owner, title, description, imageUrl, category, order, isPrivate, isPublished } = req.body;
  if (!owner || !title || !description) {
    res.status(400).json({ success: false, error: 'Owner, title, and description are required.' });
    return;
  }

  const store = getStore();
  const newCard: IPersonalCard = {
    _id: generateId('card'),
    owner,
    title,
    description,
    imageUrl,
    category: category || 'Memory',
    order: Number(order) || store.cards.length + 1,
    isPrivate: Boolean(isPrivate),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : !isPrivate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.cards.push(newCard);
  saveDatabase();
  res.status(201).json({ success: true, data: newCard });
}

export function updatePersonalCard(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.cards.findIndex(c => c._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Card not found.' });
    return;
  }

  const existing = store.cards[index];
  const updated: IPersonalCard = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  if (updated.isPrivate) {
    updated.isPublished = false;
  }

  store.cards[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deletePersonalCard(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  store.cards = store.cards.filter(c => c._id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Card deleted successfully.' });
}

// --- LOVE LETTERS CRUD ---
export function getAdminLoveLetters(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({ success: true, data: store.loveLetters });
}

export function createLoveLetter(req: AuthenticatedRequest, res: Response): void {
  const { title, content, date, imageUrl, mood, isPrivate, isPublished } = req.body;
  if (!title || !content) {
    res.status(400).json({ success: false, error: 'Title and content are required.' });
    return;
  }

  const store = getStore();
  const newLetter: ILoveLetter = {
    _id: generateId('let'),
    title,
    content,
    date: date || new Date().toISOString().split('T')[0],
    imageUrl,
    mood: mood || 'Deep Love',
    isPrivate: Boolean(isPrivate),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : !isPrivate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.loveLetters.push(newLetter);
  saveDatabase();
  res.status(201).json({ success: true, data: newLetter });
}

export function updateLoveLetter(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.loveLetters.findIndex(l => l._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Love letter not found.' });
    return;
  }

  const existing = store.loveLetters[index];
  const updated: ILoveLetter = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  if (updated.isPrivate) {
    updated.isPublished = false;
  }

  store.loveLetters[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deleteLoveLetter(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  store.loveLetters = store.loveLetters.filter(l => l._id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Love letter deleted.' });
}

// --- FUTURE GOALS CRUD ---
export function getAdminFuture(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({ success: true, data: store.futureGoals.sort((a, b) => a.order - b.order) });
}

export function createFutureGoal(req: AuthenticatedRequest, res: Response): void {
  const { title, description, category, targetDate, completed, imageUrl, isPrivate, isPublished, order } = req.body;
  if (!title || !description) {
    res.status(400).json({ success: false, error: 'Title and description are required.' });
    return;
  }

  const store = getStore();
  const newGoal: IFutureGoal = {
    _id: generateId('fut'),
    title,
    description,
    category: category || 'Experiences',
    targetDate,
    completed: Boolean(completed),
    imageUrl,
    isPrivate: Boolean(isPrivate),
    isPublished: isPublished !== undefined ? Boolean(isPublished) : !isPrivate,
    order: Number(order) || store.futureGoals.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.futureGoals.push(newGoal);
  saveDatabase();
  res.status(201).json({ success: true, data: newGoal });
}

export function updateFutureGoal(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.futureGoals.findIndex(f => f._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Goal not found.' });
    return;
  }

  const existing = store.futureGoals[index];
  const updated: IFutureGoal = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  if (updated.isPrivate) {
    updated.isPublished = false;
  }

  store.futureGoals[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deleteFutureGoal(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  store.futureGoals = store.futureGoals.filter(f => f._id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Goal deleted.' });
}

// --- SITE SETTINGS ---
export function getAdminSettings(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({ success: true, data: store.settings });
}

export function updateAdminSettings(req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...req.body,
    _id: store.settings._id,
    updatedAt: new Date().toISOString()
  };

  saveDatabase();
  res.json({ success: true, data: store.settings });
}
