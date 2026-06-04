"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    likes: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, required: true }
        }
    ],
    comments: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, required: true },
            text: { type: String, required: [true, 'Comment content cannot be empty'] },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Post', postSchema);
