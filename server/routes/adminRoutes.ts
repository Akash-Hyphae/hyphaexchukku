import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth.ts';
import { upload } from '../middleware/upload.ts';
import {
  getDashboardStats,
  getAdminGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getAdminTimeline,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  getAdminCards,
  createPersonalCard,
  updatePersonalCard,
  deletePersonalCard,
  getAdminLoveLetters,
  createLoveLetter,
  updateLoveLetter,
  deleteLoveLetter,
  getAdminFuture,
  createFutureGoal,
  updateFutureGoal,
  deleteFutureGoal,
  getAdminSettings,
  updateAdminSettings
} from '../controllers/adminController.ts';

const router = Router();

// Protect all admin routes
router.use(requireAdminAuth);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Gallery
router.get('/gallery', getAdminGallery);
router.post('/gallery', createGalleryImage);
router.put('/gallery/:id', updateGalleryImage);
router.delete('/gallery/:id', deleteGalleryImage);

// Timeline
router.get('/timeline', getAdminTimeline);
router.post('/timeline', createTimelineEvent);
router.put('/timeline/:id', updateTimelineEvent);
router.delete('/timeline/:id', deleteTimelineEvent);

// Cards
router.get('/cards', getAdminCards);
router.post('/cards', createPersonalCard);
router.put('/cards/:id', updatePersonalCard);
router.delete('/cards/:id', deletePersonalCard);

// Love Letters
router.get('/love-letter', getAdminLoveLetters);
router.post('/love-letter', createLoveLetter);
router.put('/love-letter/:id', updateLoveLetter);
router.delete('/love-letter/:id', deleteLoveLetter);

// Future Goals
router.get('/future', getAdminFuture);
router.post('/future', createFutureGoal);
router.put('/future/:id', updateFutureGoal);
router.delete('/future/:id', deleteFutureGoal);

// Settings
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

// Image Upload
router.post('/upload', upload.single('photo'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No file uploaded.' });
    return;
  }
  const relativePath = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    imageUrl: relativePath,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

export default router;
