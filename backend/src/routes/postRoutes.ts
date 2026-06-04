import { Router } from 'express';
import { createPost, getAllPosts, toggleLikePost, addCommentToPost } from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = Router();

// Feed mapping
router.route('/')
  .get(getAllPosts)        // Publicly readable feed
  .post(protect, createPost); // Protected account publishing

// Interaction lines
router.put('/:id/like', protect, toggleLikePost);
router.post('/:id/comment', protect, addCommentToPost);

export default router; 