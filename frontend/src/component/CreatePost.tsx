import React, { useRef, useState } from 'react';
import API from '../api';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

interface CreatePostProps {
  onPostCreated: (newPost: any) => void;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImageName, setSelectedImageName] = useState('');
  const [error, setError] = useState('');

  const hasPostText = textContent.trim().length > 0;
  const canPublish = hasPostText || imageUrl.trim().length > 0;

  const resetImageSelection = () => {
    setImageUrl('');
    setSelectedImageName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      resetImageSelection();
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('Please choose an image smaller than 5 MB.');
      resetImageSelection();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        setError('We could not read that image. Please try another file.');
        resetImageSelection();
        return;
      }

      setError('');
      setImageUrl(result);
      setSelectedImageName(file.name);
    };
    reader.onerror = () => {
      setError('We could not read that image. Please try another file.');
      resetImageSelection();
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!canPublish) {
      setError('Please add some text or choose an image to share your post.');
      return;
    }

    try {
      const { data } = await API.post('/posts', { textContent, imageUrl });
      onPostCreated(data);
      setTextContent('');
      resetImageSelection();
    } catch (err: any) {
      if (err.response?.status === 413) {
        setError('That image is too large to upload right now. Please choose a smaller file.');
        return;
      }

      setError(err.response?.data?.message || 'Error publishing post');
    }
  };

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '12px',
        bgcolor: 'background.paper',
        boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.35)',
        border: isLight ? 'none' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 46, height: 46, fontWeight: 700 }}>A</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            Create a post
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            Share progress, ask a question, or post a fresh update for your team.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="What are you building or thinking about today?"
          value={textContent}
          onChange={(event) => setTextContent(event.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              alignItems: 'flex-start',
              borderRadius: '12px',
              bgcolor: isLight ? '#f8fafc' : alpha('#ffffff', 0.04),
            },
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelection}
        />

        {imageUrl && (
          <Box
            sx={{
              mb: 2,
              p: 1.25,
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: isLight ? '#f8fafc' : alpha('#ffffff', 0.03),
            }}
          >
            <Box
              component="img"
              src={imageUrl}
              alt="Selected upload preview"
              sx={{
                width: '100%',
                maxHeight: 280,
                objectFit: 'cover',
                borderRadius: '10px',
                display: 'block',
                mb: 1.25,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: 13 }} noWrap>
                {selectedImageName || 'Selected image'}
              </Typography>
              <Button
                variant="text"
                color="inherit"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={resetImageSelection}
                sx={{
                  flexShrink: 0,
                  textTransform: 'none',
                  color: 'text.secondary',
                  borderRadius: '10px',
                }}
              >
                Remove
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="text"
            startIcon={<ImageOutlinedIcon />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
              borderRadius: '12px',
              px: 1.5,
              '&:hover': { bgcolor: isLight ? '#f3f4f6' : alpha('#ffffff', 0.05) },
            }}
          >
            {imageUrl ? 'Change image' : 'Choose image'}
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!canPublish}
            endIcon={<SendRoundedIcon />}
            sx={{
              bgcolor: 'primary.main',
              textTransform: 'none',
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0069d9', boxShadow: 'none' },
              '&.Mui-disabled': {
                bgcolor: isLight ? '#dbeafe' : alpha('#007bff', 0.3),
                color: isLight ? '#7c8aa5' : alpha('#ffffff', 0.5),
              },
            }}
          >
            Publish
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
