import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { CreatePost } from './CreatePost';
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  List,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

interface PostData {
  _id: string;
  username: string;
  textContent: string;
  imageUrl: string;
  likes: { userId: string; username: string }[];
  comments: { username: string; text: string; createdAt: string }[];
  createdAt: string;
}

const formatPostDate = (createdAt: string) => {
  const postDate = new Date(createdAt);
  const today = new Date();

  if (postDate.toDateString() === today.toDateString()) {
    return 'Today';
  }

  return postDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const SocialFeed: React.FC = () => {
  const auth = useContext(AuthContext);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [posts, setPosts] = useState<PostData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [activeCommentBox, setActiveCommentBox] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  const fetchPosts = async (pageNum: number, append: boolean) => {
    if (!append) {
      setIsLoading(true);
    }

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
    } finally {
      if (!append) {
        setIsLoading(false);
      }
    }
  };

  const handleOptimisticLike = async (postId: string) => {
    if (!auth?.user) {
      alert('Please sign in to react to posts!');
      return;
    }

    const currentUserId = auth.user._id;
    const currentUsername = auth.user.username;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id !== postId) {
          return post;
        }

        const alreadyLiked = post.likes.some((like) => like.userId === currentUserId);
        const updatedLikes = alreadyLiked
          ? post.likes.filter((like) => like.userId !== currentUserId)
          : [...post.likes, { userId: currentUserId, username: currentUsername }];

        return { ...post, likes: updatedLikes };
      }),
    );

    try {
      await API.put(`/posts/${postId}/like`);
    } catch (err) {
      fetchPosts(1, false);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) {
      return;
    }

    try {
      const { data } = await API.post(`/posts/${postId}/comment`, { text });
      setPosts((prev) => prev.map((post) => (post._id === postId ? data : post)));
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  const cardSx = {
    borderRadius: '12px',
    bgcolor: 'background.paper',
    boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.35)',
    border: isLight ? 'none' : '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {auth?.user && (
        <Card sx={{ ...cardSx, p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                Welcome back, {auth.user.username}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                Catch up on new updates from your network and share what you are working on.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutRoundedIcon />}
              onClick={auth.logout}
              sx={{
                flexShrink: 0,
                textTransform: 'none',
                borderRadius: '12px',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: alpha('#007bff', 0.08) },
              }}
            >
              Logout
            </Button>
          </Box>
        </Card>
      )}

      {auth?.user && <CreatePost onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : posts.length === 0 ? (
        <Card sx={{ ...cardSx, p: { xs: 3, sm: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1.5,
              minHeight: 220,
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: alpha('#007bff', isLight ? 0.1 : 0.18),
                color: 'primary.main',
              }}
            >
              <TipsAndUpdatesOutlinedIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              No tasks or updates posted yet.
            </Typography>
            <Typography sx={{ maxWidth: 420, color: 'text.secondary', lineHeight: 1.6 }}>
              Be the first to share what you're working on!
            </Typography>
          </Box>
        </Card>
      ) : (
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {posts.map((post) => {
            const isLikedByUser = post.likes.some((like) => like.userId === auth?.user?._id);

            return (
              <Card key={post._id} sx={cardSx}>
                <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontWeight: 700 }}>
                    {post.username[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{post.username}</Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                      {formatPostDate(post.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {post.textContent && (
                  <Typography
                    sx={{
                      px: { xs: 2, sm: 2.5 },
                      pb: post.imageUrl ? 2 : 2.5,
                      color: 'text.primary',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {post.textContent}
                  </Typography>
                )}

                {post.imageUrl && (
                  <Box
                    component="img"
                    src={post.imageUrl}
                    alt="Post asset"
                    sx={{
                      width: '100%',
                      maxHeight: 420,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}

                <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 1.25 }}>
                  <Divider sx={{ mb: 1.25, borderColor: 'divider' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      startIcon={isLikedByUser ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                      onClick={() => handleOptimisticLike(post._id)}
                      sx={{
                        flex: 1,
                        justifyContent: 'center',
                        textTransform: 'none',
                        fontWeight: 700,
                        color: isLikedByUser ? 'primary.main' : 'text.secondary',
                        borderRadius: '10px',
                        py: 1,
                        '&:hover': {
                          bgcolor: isLikedByUser ? alpha('#007bff', 0.12) : alpha(theme.palette.text.secondary, 0.08),
                        },
                      }}
                    >
                      Like {post.likes.length > 0 ? `(${post.likes.length})` : ''}
                    </Button>
                    <Button
                      startIcon={<ChatBubbleOutlineRoundedIcon />}
                      onClick={() =>
                        setActiveCommentBox((prev) => ({ ...prev, [post._id]: !prev[post._id] }))
                      }
                      sx={{
                        flex: 1,
                        justifyContent: 'center',
                        textTransform: 'none',
                        fontWeight: 700,
                        color: activeCommentBox[post._id] ? 'primary.main' : 'text.secondary',
                        borderRadius: '10px',
                        py: 1,
                        '&:hover': {
                          bgcolor: activeCommentBox[post._id]
                            ? alpha('#007bff', 0.12)
                            : alpha(theme.palette.text.secondary, 0.08),
                        },
                      }}
                    >
                      Comment {post.comments.length > 0 ? `(${post.comments.length})` : ''}
                    </Button>
                  </Box>
                </Box>

                {activeCommentBox[post._id] && (
                  <Box
                    sx={{
                      px: { xs: 2, sm: 2.5 },
                      pb: { xs: 2, sm: 2.5 },
                      pt: 1,
                      bgcolor: isLight ? '#fbfcfd' : alpha('#ffffff', 0.03),
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: post.comments.length ? 2 : 0 }}>
                      {post.comments.map((comment, index) => (
                        <Box
                          key={`${comment.username}-${comment.createdAt}-${index}`}
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            bgcolor: 'background.paper',
                            boxShadow: isLight ? '0 1px 2px rgba(15, 23, 42, 0.06)' : 'none',
                            border: isLight ? 'none' : '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary', mr: 1 }}>
                            {comment.username}
                          </Typography>
                          <Typography component="span" sx={{ color: 'text.secondary' }}>
                            {comment.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {auth?.user && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Write a comment..."
                          value={commentInputs[post._id] || ''}
                          onChange={(event) =>
                            setCommentInputs((prev) => ({ ...prev, [post._id]: event.target.value }))
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              bgcolor: 'background.paper',
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleCommentSubmit(post._id)}
                          sx={{
                            bgcolor: 'primary.main',
                            textTransform: 'none',
                            borderRadius: '12px',
                            px: 2.25,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#0069d9', boxShadow: 'none' },
                          }}
                        >
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
      )}

      {hasMore && !isLoading && (
        <Button
          fullWidth
          variant="text"
          onClick={() => fetchPosts(page + 1, true)}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            color: 'primary.main',
            borderRadius: '12px',
            py: 1.25,
            bgcolor: 'background.paper',
            boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.35)',
            border: isLight ? 'none' : '1px solid rgba(255,255,255,0.08)',
            '&:hover': { bgcolor: isLight ? '#f8fbff' : alpha('#007bff', 0.1) },
          }}
        >
          Load More Posts
        </Button>
      )}
    </Box>
  );
};
