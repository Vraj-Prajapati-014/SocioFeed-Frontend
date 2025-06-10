import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Avatar, List, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getPostById } from '../services/postService';
import PostCarousel from './PostCarousel';
import PostInteraction from './PostInteraction';
import Comment from './Comment';
import Input from '../../../components/common/Input/Input'; // Custom Input
import Spinner from '../../../components/common/Spinner/Spinner'; // Custom Spinner
import Button from '../../../components/common/Button/Button'; // Custom Button
import useAuth from '../../auth/hooks/useAuth';
import { useComments } from '../hooks/useComments';
import ThemeContext from '../../../utils/context/ThemeContext';

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = React.useContext(ThemeContext);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['post', postId, page],
    queryFn: () => getPostById(postId, page, limit),
    enabled: !!postId && !!user?.id,
  });

  const { handleCreateComment, loading: commentLoading, error: commentError } = useComments(postId, refetch);

  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    await handleCreateComment(newComment);
    setNewComment('');
  };

  const handleProfileClick = () => {
    if (!post?.author?.id) {
      console.error('Missing author ID for post:', post);
      return;
    }
    navigate(`/profile/${post.author.id}`, { state: { username: post.author.username } }); 
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Spinner />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <ErrorMessage error={error} onRetry={refetch} />
      </Box>
    );
  }

  const post = data?.post;
  const totalComments = data?.totalComments;

  console.log('PostDetail - Post data:', post);

  if (!post?.author) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography color="error">
          Error: Post author data is missing.
        </Typography>
      </Box>
    );
  }

  // Log commentError for debugging
  if (commentError) {
    console.error('PostDetail - Comment creation error:', commentError);
  }

  return (
    <Box className="max-w-5xl mx-auto py-6 flex flex-col md:flex-row gap-4">
      <Box className="flex-1">
        {post.images && post.images.length > 0 ? (
          <PostCarousel images={post.images} /> 
        ) : (
          <Box className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Typography>No Image Available</Typography>
          </Box>
        )}
      </Box>

      <Box className="flex-1 flex flex-col min-h-[500px] border border-gray-200 dark:border-gray-700 rounded-lg">
        <Box className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <IconButton onClick={() => navigate(-1)} className="mr-2">
            <ArrowBack />
          </IconButton>
          <Avatar
            src={post.author?.avatarUrl || '/default-avatar.png'} 
            alt={post.author?.username || 'Unknown'} 
            className="w-10 h-10 rounded-full mr-3 cursor-pointer"
            onClick={handleProfileClick}
          />
          <Typography
            variant="subtitle1"
            className="font-semibold cursor-pointer"
            onClick={handleProfileClick}
          >
            {post.author?.username || 'Unknown User'} 
          </Typography>
        </Box>

        <Box className="flex-1 overflow-y-auto p-4">
          {post.content && (
            <Typography
              variant="body1"
              className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
              sx={{ mb: 2 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
          {post.comments?.length > 0 ? (
            <List>
              {post.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  fetchPosts={refetch}
                  user={user}
                />
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">No comments yet.</Typography>
          )}
          {totalComments > page * limit && (
            <Button onClick={() => setPage(page + 1)} className="mt-2">
              Load More Comments
            </Button>
          )}
        </Box>

        <Box className="p-4 border-t border-gray-200 dark:border-gray-700">
          <PostInteraction post={post} />
          <Box className="mt-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              disabled={commentLoading.create}
              multiline
              rows={1}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={false}
              className="mt-2"
              sx={{ display: 'block' }}
            >
              Post
            </Button>
            {commentError && (
              <Typography color="error" className="mt-1 text-sm">
                {commentError}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetail;