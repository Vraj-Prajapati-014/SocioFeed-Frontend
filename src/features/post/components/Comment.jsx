import React, { useState } from 'react';
import { Box, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Button, TextField } from '@mui/material';
import { ThumbUp } from '@mui/icons-material';
import { useComments } from '../hooks/useComments';

const Comment = ({ comment, postId, fetchPosts, user, level = 0 }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const { handleCreateComment, handleLikeComment, handleDeleteComment, error } = useComments(postId, fetchPosts);

  return (
    <Box className={level > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''} sx={{ mb: 2 }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={comment.user.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.user.username}
          secondary={
            <>
              <Typography variant="body2">{comment.content}</Typography>
              <Box className="flex gap-2 mt-2">
                <Button
                  size="small"
                  startIcon={<ThumbUp />}
                  onClick={() => handleLikeComment(comment.id, comment.hasLiked)}
                >
                  {comment.hasLiked ? 'Unlike' : 'Like'} ({comment.likesCount || 0})
                </Button>
                <Button size="small" onClick={() => setShowReplyInput(!showReplyInput)}>
                  Reply
                </Button>
                {comment.userId === user?.id && (
                  <Button size="small" color="error" onClick={() => handleDeleteComment(comment.id)}>
                    Delete
                  </Button>
                )}
              </Box>
              {showReplyInput && (
                <Box className="mt-2">
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <Box className="mt-2">
                    <Button
                      onClick={() => {
                        handleCreateComment(replyContent, comment.id);
                        setReplyContent('');
                        setShowReplyInput(false);
                      }}
                      variant="contained"
                      size="small"
                    >
                      Submit Reply
                    </Button>
                    <Button onClick={() => setShowReplyInput(false)} size="small" className="ml-2">
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
              {error && <Typography color="error" className="mt-2">{error}</Typography>}
            </>
          }
        />
      </ListItem>
      {comment.replies?.map(reply => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          fetchPosts={fetchPosts}
          user={user}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

export default Comment;