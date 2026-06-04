import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { CreatePost } from './CreatePost';
import { 
  Container, Card, Box, Typography, Avatar, IconButton, 
  Divider, TextField, Button, List, ListItem, ListItemText 
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubble';
interface PostData {
  _id: string;
  username: string;
  textContent: string;
  imageUrl: string;
  likes: { userId: string; username: string }[];
  comments: { username: string; text: string; createdAt: string }[];
  createdAt: string;
}

export const SocialFeed: React.FC = () => {
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [activeCommentBox, setActiveCommentBox] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  const fetchPosts = async (pageNum: number, append: boolean) => {
    try {
      const { data } = await API.get(`/posts?page=${pageNum}&limit=5`);
      if (append) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setHasMore(data.hasMore);
      setPage(data.currentPage);
    } catch (err) {
      console.error('Error querying social feed items:', err);
    }
  };

  const handleOptimisticLike = async (postId: string) => {
    if (!auth?.user) return alert('Please sign in to react to posts!');

    const currentUserId = auth.user._id;
    const currentUsername = auth.user.username;

    // 1. Instantly mutate local state before waiting for network resolution
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const alreadyLiked = post.likes.some((l) => l.userId === currentUserId);
          let updatedLikes = [...post.likes];

          if (alreadyLiked) {
            updatedLikes = updatedLikes.filter((l) => l.userId !== currentUserId);
          } else {
            updatedLikes.push({ userId: currentUserId, username: currentUsername });
          }
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );

    try {
      // 2. Perform the async network transaction in the background
      await API.put(`/posts/${postId}/like`);
    } catch (err) {
      // If server communication snaps, revert to fresh DB state
      fetchPosts(1, false);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const { data } = await API.post(`/posts/${postId}/comment`, { text });
      setPosts((prev) => prev.map((p) => (p._id === postId ? data : p)));
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {auth?.user && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
            Welcome, {auth.user.username}!
          </Typography>
          <Button variant="outlined" color="error" size="small" onClick={auth.logout} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Logout
          </Button>
        </Box>
      )}

      {auth?.user && <CreatePost onPostCreated={(newPost) => setPosts([newPost, ...posts])} />}

      <List disablePadding>
        {posts.map((post) => {
          const isLikedByUser = post.likes.some((l) => l.userId === auth?.user?._id);

          return (
            <Card key={post._id} sx={{ mb: 3, borderRadius: 3, boxShadow: '0px 2px 12px rgba(0,0,0,0.04)' }}>
              {/* Header Box */}
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#007bff', mr: 2 }}>{post.username[0].toUpperCase()}</Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{post.username}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {/* Text Body */}
              {post.textContent && (
                <Typography variant="body1" sx={{ px: 2, pb: 2, color: '#2c3e50', whitespace: 'pre-line' }}>
                  {post.textContent}
                </Typography>
              )}

              {/* Content Image */}
              {post.imageUrl && (
                <Box component="img" src={post.imageUrl} alt="Post asset" sx={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
              )}

              {/* Action Ribbon */}
              <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleOptimisticLike(post._id)} sx={{ color: isLikedByUser ? '#007bff' : '#6c757d' }}>
                    {isLikedByUser ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  </IconButton>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#6c757d', ml: 0.5 }}>
                    {post.likes.length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => setActiveCommentBox(prev => ({ ...prev, [post._id]: !prev[post._id] }))} sx={{ color: '#6c757d' }}>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#6c757d', ml: 0.5 }}>
                    {post.comments.length}
                  </Typography>
                </Box>
              </Box>

              {/* Comment Segment */}
              {activeCommentBox[post._id] && (
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #eee' }}>
                  <Divider sx={{ mb: 1 }} />
                  {post.comments.map((comment, i) => (
                    <Box key={i} sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600, mr: 1, color: '#333' }}>
                        {comment.username}
                      </Typography>
                      <Typography variant="body2" component="span" color="text.primary">
                        {comment.text}
                      </Typography>
                    </Box>
                  ))}

                  {auth?.user && (
                    <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                      <TextField
                        size="small" fullWidth placeholder="Write a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                      />
                      <Button variant="contained" onClick={() => handleCommentSubmit(post._id)} sx={{ bgcolor: '#007bff', textTransform: 'none' }}>
                        Reply
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Card>
          );
        })}
      </List>

      {/* Pagination trigger hook */}
      {hasMore && (
        <Button 
          fullWidth variant="text" onClick={() => fetchPosts(page + 1, true)} 
          sx={{ mt: 2, color: '#007bff', fontWeight: 600, textTransform: 'none' }}
        >
          Load More Posts
        </Button>
      )}
    </Container>
  );
};