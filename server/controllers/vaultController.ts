import { Response } from 'express';
import { getStore, saveDatabase } from '../config/db.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { IPrivateNote, IPrivateJournal, ISurpriseIdea, IGalleryImage, ILoveLetter } from '../types/index.ts';

const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// --- 1. PRIVATE MEMORIES & HIDDEN PHOTOS ---
export function getPrivateMemories(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  const memories = store.gallery.filter(img => img.isPrivate || !img.isPublished);
  res.json({
    success: true,
    data: memories.sort((a, b) => b.order - a.order)
  });
}

export function updateMemoryPrivacy(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const { isPrivate, isPublished, privateNote } = req.body;
  const store = getStore();

  const item = store.gallery.find(img => img._id === id);
  if (!item) {
    res.status(404).json({ success: false, error: 'Memory not found.' });
    return;
  }

  if (isPrivate !== undefined) item.isPrivate = Boolean(isPrivate);
  if (isPublished !== undefined) item.isPublished = Boolean(isPublished);
  if (privateNote !== undefined) item.privateNote = privateNote;
  
  // Rule: if an item is marked private, it must never be published publicly
  if (item.isPrivate) {
    item.isPublished = false;
  }

  item.updatedAt = new Date().toISOString();
  saveDatabase();

  res.json({ success: true, data: item, message: `Privacy updated. Now ${item.isPrivate ? 'PRIVATE' : item.isPublished ? 'PUBLIC' : 'DRAFT'}` });
}

// --- 2. PRIVATE LETTERS ---
export function getPrivateLetters(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  const privateLetters = store.loveLetters.filter(l => l.isPrivate);
  res.json({
    success: true,
    data: privateLetters
  });
}

export function createPrivateLetter(req: AuthenticatedRequest, res: Response): void {
  const { title, content, date, mood } = req.body;
  if (!title || !content) {
    res.status(400).json({ success: false, error: 'Title and content are required.' });
    return;
  }

  const store = getStore();
  const newLetter: ILoveLetter = {
    _id: generateId('priv_let'),
    title,
    content,
    date: date || new Date().toISOString().split('T')[0],
    mood: mood || 'Unfiltered Truth',
    isPrivate: true,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.loveLetters.push(newLetter);
  saveDatabase();
  res.status(201).json({ success: true, data: newLetter });
}

// --- 3. PRIVATE NOTES ---
export function getPrivateNotes(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({
    success: true,
    data: store.privateNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });
}

export function createPrivateNote(req: AuthenticatedRequest, res: Response): void {
  const { title, content, category, tags } = req.body;
  if (!title || !content) {
    res.status(400).json({ success: false, error: 'Title and content are required.' });
    return;
  }

  const store = getStore();
  const newNote: IPrivateNote = {
    _id: generateId('note'),
    title,
    content,
    category: category || 'Random thoughts',
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.privateNotes.unshift(newNote);
  saveDatabase();
  res.status(201).json({ success: true, data: newNote });
}

export function updatePrivateNote(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.privateNotes.findIndex(n => n._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Note not found.' });
    return;
  }

  const existing = store.privateNotes[index];
  const updated: IPrivateNote = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  store.privateNotes[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deletePrivateNote(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  store.privateNotes = store.privateNotes.filter(n => n._id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Note deleted.' });
}

// --- 4. PRIVATE JOURNAL ---
export function getPrivateJournals(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({
    success: true,
    data: store.privateJournals.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
  });
}

export function createPrivateJournal(req: AuthenticatedRequest, res: Response): void {
  const { title, content, date, mood, tags } = req.body;
  if (!title || !content) {
    res.status(400).json({ success: false, error: 'Title and content are required.' });
    return;
  }

  const store = getStore();
  const newJournal: IPrivateJournal = {
    _id: generateId('jr'),
    title,
    content,
    date: date || new Date().toISOString().split('T')[0],
    mood: mood || 'Reflective',
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.privateJournals.unshift(newJournal);
  saveDatabase();
  res.status(201).json({ success: true, data: newJournal });
}

export function updatePrivateJournal(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.privateJournals.findIndex(j => j._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Journal entry not found.' });
    return;
  }

  const existing = store.privateJournals[index];
  const updated: IPrivateJournal = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  store.privateJournals[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deletePrivateJournal(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  store.privateJournals = store.privateJournals.filter(j => j._id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Journal entry deleted.' });
}

// --- 5. SURPRISE IDEAS ---
export function getSurpriseIdeas(_req: AuthenticatedRequest, res: Response): void {
  const store = getStore();
  res.json({
    success: true,
    data: store.surpriseIdeas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });
}

export function createSurpriseIdea(req: AuthenticatedRequest, res: Response): void {
  const { title, description, date, location, budget, checklist, status, images, notes } = req.body;
  if (!title || !description) {
    res.status(400).json({ success: false, error: 'Title and description are required.' });
    return;
  }

  const store = getStore();
  const newSurprise: ISurpriseIdea = {
    _id: generateId('surp'),
    title,
    description,
    date: date || '',
    location: location || '',
    budget: budget || '',
    checklist: Array.isArray(checklist) ? checklist : [],
    status: status || 'Idea',
    images: Array.isArray(images) ? images : [],
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.surpriseIdeas.unshift(newSurprise);
  saveDatabase();
  res.status(201).json({ success: true, data: newSurprise });
}

export function updateSurpriseIdea(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  const index = store.surpriseIdeas.findIndex(s => s._id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Surprise idea not found.' });
    return;
  }

  const existing = store.surpriseIdeas[index];
  const updated: ISurpriseIdea = {
    ...existing,
    ...req.body,
    _id: existing._id,
    updatedAt: new Date().toISOString()
  };

  store.surpriseIdeas[index] = updated;
  saveDatabase();
  res.json({ success: true, data: updated });
}

export function deleteSurpriseIdea(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const store = getStore();
  store.surpriseIdeas = store.surpriseIdeas.filter(s => s._id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Surprise idea deleted.' });
}
