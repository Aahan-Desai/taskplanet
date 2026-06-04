"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentToPost = exports.toggleLikePost = exports.getAllPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
// @desc    Create a new social post (Text, Image, or both)
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
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
        const newPost = await Post_1.default.create({
            user: req.user._id,
            username: req.user.username,
            textContent: textContent || '',
            imageUrl: imageUrl || '',
            likes: [],
            comments: []
        });
        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createPost = createPost;
// @desc    Get all public posts with pagination
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
    try {
        // Bonus Logic: Efficient pagination logic using page and limit query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Fetch posts sorted by newest arrival first
        const posts = await Post_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalPosts = await Post_1.default.countDocuments();
        res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            hasMore: page * limit < totalPosts
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllPosts = getAllPosts;
// @desc    Toggle a Like status on a post instantly
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const post = await Post_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post target not found' });
            return;
        }
        // Check if user already liked the post
        const searchLikeIndex = post.likes.findIndex((like) => like.userId.toString() === req.user._id.toString());
        if (searchLikeIndex > -1) {
            // User already liked it, so remove (unlike)
            post.likes.splice(searchLikeIndex, 1);
        }
        else {
            // Add user to likes array (capturing username to fulfill assignment details)
            post.likes.push({
                userId: req.user._id,
                username: req.user.username
            });
        }
        await post.save();
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.toggleLikePost = toggleLikePost;
// @desc    Add a comment to a specific post
// @route   POST /api/posts/:id/comment
// @access  Private
const addCommentToPost = async (req, res) => {
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
        const post = await Post_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post target not found' });
            return;
        }
        // Embed the comment object cleanly inside the target post document
        const newComment = {
            userId: req.user._id,
            username: req.user.username,
            text,
            createdAt: new Date()
        };
        post.comments.push(newComment);
        await post.save();
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addCommentToPost = addCommentToPost;
