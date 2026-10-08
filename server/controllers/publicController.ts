import { Request, Response } from 'express';
import { getStore } from '../config/db.ts';

// Helper to sanitize items and guarantee no private fields leak
function cleanPublicGalleryItem(item: any) {
  const { privateNote, ...publicItem } = item;
  return publicItem;
}

export function getPublicGallery(req: Request, res: Response): void {
  const { category } = req.query;
  const store = getStore();

  let items = store.gallery
    .filter(img => !img.isPrivate && img.isPublished)
    .sort((a, b) => a.order - b.order)
    .map(cleanPublicGalleryItem);

  if (category && category !== 'All') {
    items = items.filter(img => img.category === category);
  }

  res.json({
    success: true,
    data: items,
    count: items.length
  });
}

export function getPublicTimeline(_req: Request, res: Response): void {
  const store = getStore();

  const events = store.timeline
    .filter(ev => !ev.isPrivate && ev.isPublished)
    .sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    data: events,
    count: events.length
  });
}

export function getPublicCards(req: Request, res: Response): void {
  const { owner } = req.params;
  const store = getStore();

  if (owner !== 'chukku' && owner !== 'hyphae') {
    res.status(400).json({ success: false, error: 'Invalid owner parameter. Must be chukku or hyphae.' });
    return;
  }

  const cards = store.cards
    .filter(card => card.owner === owner && !card.isPrivate && card.isPublished)
    .sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    data: cards,
    count: cards.length
  });
}

export function getPublicLoveLetter(_req: Request, res: Response): void {
  const store = getStore();

  // Find the published, public love letter
  const letters = store.loveLetters
    .filter(l => !l.isPrivate && l.isPublished);

  // Return the main public letter
  const letter = letters[0] || null;

  res.json({
    success: true,
    data: letter
  });
}

export function getPublicFuture(_req: Request, res: Response): void {
  const store = getStore();

  const goals = store.futureGoals
    .filter(g => !g.isPrivate && g.isPublished)
    .sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    data: goals,
    count: goals.length
  });
}

export function getPublicSettings(_req: Request, res: Response): void {
  const store = getStore();
  const settings = { ...store.settings };

  // If final surprise is marked private, do not return it publicly!
  if (settings.finalSurpriseIsPrivate) {
    settings.finalSurpriseTitle = '';
    settings.finalSurpriseMessage = '';
    settings.finalSurpriseImage = '';
  }

  res.json({
    success: true,
    data: settings
  });
}

export function getPublicFinalReveal(_req: Request, res: Response): void {
  const store = getStore();

  if (store.settings.finalSurpriseIsPrivate) {
    res.status(404).json({
      success: false,
      error: 'Final surprise is currently private and accessible only inside the Admin Vault.'
    });
    return;
  }

  res.json({
    success: true,
    data: {
      title: store.settings.finalSurpriseTitle,
      message: store.settings.finalSurpriseMessage,
      image: store.settings.finalSurpriseImage
    }
  });
}
