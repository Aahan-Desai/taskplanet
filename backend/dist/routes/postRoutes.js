"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Feed mapping
router.route('/')
    .get(postController_1.getAllPosts) // Publicly readable feed
    .post(auth_1.protect, postController_1.createPost); // Protected account publishing
// Interaction lines
router.put('/:id/like', auth_1.protect, postController_1.toggleLikePost);
router.post('/:id/comment', auth_1.protect, postController_1.addCommentToPost);
exports.default = router;
