import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useUpdateProfile } from '../hook/useUpdateProfile';
import { PROFILE_CONSTANTS } from '../../profile/constants/profileConstants'
import { showToast } from '../../../utils/helpers/toast';

const EditProfileForm = ({ profile, onSuccess }) => {
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const { mutate: updateProfile, isLoading } = useUpdateProfile();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length > PROFILE_CONSTANTS.MAX_USERNAME_LENGTH) {
      showToast(`Username must be at most ${PROFILE_CONSTANTS.MAX_USERNAME_LENGTH} characters`, 'error');
      return;
    }
    if (bio.length > PROFILE_CONSTANTS.MAX_BIO_LENGTH) {
      showToast(`Bio must be at most ${PROFILE_CONSTANTS.MAX_BIO_LENGTH} characters`, 'error');
      return;
    }
    updateProfile(
      { username, bio },
      {
        onSuccess: () => {
          showToast('Profile updated successfully', 'success');
          onSuccess();
        },
        onError: (error) => {
          showToast(error.message || 'Failed to update profile', 'error');
        },
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h6">Edit Profile</Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
        inputProps={{ maxLength: PROFILE_CONSTANTS.MAX_USERNAME_LENGTH }}
        helperText={`${username.length}/${PROFILE_CONSTANTS.MAX_USERNAME_LENGTH}`}
      />
      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        multiline
        rows={4}
        inputProps={{ maxLength: PROFILE_CONSTANTS.MAX_BIO_LENGTH }}
        helperText={`${bio.length}/${PROFILE_CONSTANTS.MAX_BIO_LENGTH}`}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Box>
  );
};

export default EditProfileForm;