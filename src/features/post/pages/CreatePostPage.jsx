import React from 'react';
import { Container, Typography } from '@mui/material';
import CreatePost from '../components/CreatePost';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="py-8 max-w-2xl mx-auto">
      <Typography variant="h4" className="mb-4">Create a New Post</Typography>
      <CreatePost onSuccess={() => navigate('/dashboard')} />
    </Container>
  );
};

export default CreatePostPage;