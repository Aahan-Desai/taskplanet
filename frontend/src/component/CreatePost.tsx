import React, { useState } from 'react';
import API from '../api';
import { Card, TextField, Button, Box, Typography, Alert } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SendIcon from '@mui/icons-material/Send';

interface CreatePostProps {
  onPostCreated: (newPost: any) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validation: Ensure either text or image URL is supplied
    if (!textContent.trim() && !imageUrl.trim()) {
      setError('Please add either some text or an image URL to share your post.');
      return;
    }

    try {
      const { data } = await API.post('/posts', { textContent, imageUrl });
      onPostCreated(data);
      setTextContent('');
      setImageUrl('');
      setShowImageInput(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error publishing post');
    }
  };

  return (
    <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0px 2px 12px rgba(0,0,0,0.05)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
        Share Something New
      </Typography>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What is on your mind?..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        {showImageInput && (
          <TextField
            fullWidth
            placeholder="Paste public image link here (e.g., https://images.unsplash.com/...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="text"
            startIcon={<ImageOutlinedIcon />}
            onClick={() => setShowImageInput(!showImageInput)}
            sx={{ textTransform: 'none', color: '#6c757d' }}
          >
            {showImageInput ? 'Remove Image link' : 'Add Image link'}
          </Button>

          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ bgcolor: '#007bff', textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            Post
          </Button>
        </Box>
      </Box>
    </Card>
  );
};