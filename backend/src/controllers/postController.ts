import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Post from '../models/Post';
import { Types } from 'mongoose';

// @desc    Create a new social post (Text, Image, or both)
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { textContent, imageUrl } = req.body;

    // Requirement Check: Both fields should not be empty (either one is enough)
    if (!textContent && !imageUrl) {
      res.status(400).json({ message: 'A post must contain either text content or an image link.' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User reference missing, unauthorized' });
      return;
    }

    const newPost = await Post.create({
      user: req.user._id,
      username: req.user.username,
      textContent: textContent || '',
      imageUrl: imageUrl || '',
      likes: [],
      comments: []
    });

    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public posts with pagination
// @route   GET /api/posts
// @access  Public
export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Bonus Logic: Efficient pagination logic using page and limit query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts sorted by newest arrival first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: page * limit < totalPosts
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a Like status on a post instantly
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLikePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post target not found' });
      return;
    }

    // Check if user already liked the post
    const searchLikeIndex = post.likes.findIndex(
      (like) => like.userId.toString() === (req.user!._id as Types.ObjectId).toString()
    );

    if (searchLikeIndex > -1) {
      // User already liked it, so remove (unlike)
      post.likes.splice(searchLikeIndex, 1);
    } else {
      // Add user to likes array (capturing username to fulfill assignment details)
      post.likes.push({
        userId: req.user._id as Types.ObjectId,
        username: req.user.username
      });
    }

    await post.save();
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a specific post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addCommentToPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ message: 'Comment text field cannot be blank.' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post target not found' });
      return;
    }

    // Embed the comment object cleanly inside the target post document
    const newComment = {
      userId: req.user._id as Types.ObjectId,
      username: req.user.username,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
