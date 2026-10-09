import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.ts';
import {
  getPrivateMemories,
  updateMemoryPrivacy,
  getPrivateLetters,
  createPrivateLetter,
  updatePrivateLetter,
  deletePrivateLetter,
  getPrivateNotes,
  createPrivateNote,
  updatePrivateNote,
  deletePrivateNote,
  getPrivateJournals,
  createPrivateJournal,
  updatePrivateJournal,
  deletePrivateJournal,
  getSurpriseIdeas,
  createSurpriseIdea,
  updateSurpriseIdea,
  deleteSurpriseIdea
} from '../controllers/vaultController.ts';

const router = Router();

// Hard security barrier: Every single endpoint in vaultRoutes strictly enforces valid admin token!
router.use(requireAdminAuth);

// 1. Private Memories & Hidden Photos
router.get('/memories', getPrivateMemories);
router.put('/memories/:id/privacy', updateMemoryPrivacy);

// 2. Private Letters
router.get('/letters', getPrivateLetters);
router.post('/letters', createPrivateLetter);
router.put('/letters/:id', updatePrivateLetter);
router.delete('/letters/:id', deletePrivateLetter);

// 3. Private Notes
router.get('/notes', getPrivateNotes);
router.post('/notes', createPrivateNote);
router.put('/notes/:id', updatePrivateNote);
router.delete('/notes/:id', deletePrivateNote);

// 4. Private Journal
router.get('/journal', getPrivateJournals);
router.post('/journal', createPrivateJournal);
router.put('/journal/:id', updatePrivateJournal);
router.delete('/journal/:id', deletePrivateJournal);

// 5. Surprise Ideas
router.get('/surprises', getSurpriseIdeas);
router.post('/surprises', createSurpriseIdea);
router.put('/surprises/:id', updateSurpriseIdea);
router.delete('/surprises/:id', deleteSurpriseIdea);

export default router;
