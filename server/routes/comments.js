import express from 'express'
const router = express.Router()

import Comment from '../models/Comment.js';
// Middleware to check auth (e.g., JWT)
import verifyUser from '../middleware/verifyUser.js';
// Create comment/reply
router.post('/:postId/comments', verifyUser, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const postId = req.params.postId;

    const comment = new Comment({
      content,
      author: req.user, // From auth middleware
      post: postId,
      parent: parentId || null
    });

    await comment.save();

    // If reply, update parent's replies array (optional for optimization)
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, { $push: { replies: comment._id } });
    }

    await comment.populate(['author', 'post']); // Populate user and post
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router
