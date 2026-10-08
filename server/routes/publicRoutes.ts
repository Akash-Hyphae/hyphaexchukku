import { Router } from 'express';
import {
  getPublicGallery,
  getPublicTimeline,
  getPublicCards,
  getPublicLoveLetter,
  getPublicFuture,
  getPublicSettings,
  getPublicFinalReveal
} from '../controllers/publicController.ts';

const router = Router();

router.get('/gallery', getPublicGallery);
router.get('/timeline', getPublicTimeline);
router.get('/cards/:owner', getPublicCards);
router.get('/love-letter', getPublicLoveLetter);
router.get('/future', getPublicFuture);
router.get('/settings', getPublicSettings);
router.get('/final-reveal', getPublicFinalReveal);

export default router;
