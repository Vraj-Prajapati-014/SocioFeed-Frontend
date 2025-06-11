import React, { useState, useContext } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Card from '../../../components/common/Card/Card';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import TiptapEditor from '../../../components/TipTap/TiptapEditor';
import { useUpdateProfile } from '../hook/useUpdateProfile';
import { PROFILE_CONSTANTS } from '../../profile/constants/profileConstants';
import { showToast } from '../../../utils/helpers/toast';
import ThemeContext from '../../../utils/context/ThemeContext';

const EditProfileForm = ({ profile, onSuccess }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [editor, setEditor] = useState(null);
  const { mutate: updateProfile, isLoading } = useUpdateProfile();

  const getTextContentLength = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent.length;
  };

  const bioLength = getTextContentLength(bio);

  const handleEditorUpdate = (html) => {
    const textLength = getTextContentLength(html);
    if (textLength <= PROFILE_CONSTANTS.MAX_BIO_LENGTH) {
      setBio(html);
    } else {
      const div = document.createElement('div');
      div.innerHTML = html;
      const text = div.textContent.slice(0, PROFILE_CONSTANTS.MAX_BIO_LENGTH);
      const truncatedHtml = `<p>${text}</p>`;
      setBio(truncatedHtml);
      if (editor) {
        editor.commands.setContent(truncatedHtml);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length > PROFILE_CONSTANTS.MAX_USERNAME_LENGTH) {
      showToast(
        `Username must be at most ${PROFILE_CONSTANTS.MAX_USERNAME_LENGTH} characters`,
        'error'
      );
      return;
    }
    if (bioLength > PROFILE_CONSTANTS.MAX_BIO_LENGTH) {
      showToast(
        `Bio must be at most ${PROFILE_CONSTANTS.MAX_BIO_LENGTH} characters`,
        'error'
      );
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
    <div
  className={`min-h-screen w-full pt-6 pb-2 px-4 sm:px-6 lg:px-8 ${
    isDark ? 'bg-gray-900' : 'bg-gray-100'
  }`}
>
      <Card
        elevation={2}
        className={`w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <Box component="form" onSubmit={handleSubmit} className="space-y-6">
          <Typography
            variant="h6"
            className={isDark ? 'text-gray-200' : 'text-gray-800'}
          >
            Edit Profile
          </Typography>

       
          <Box className="flex flex-col space-y-2">
            <Typography
              className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Username
            </Typography>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength={PROFILE_CONSTANTS.MAX_USERNAME_LENGTH}
              className={`block w-full text-sm bg-transparent transition-all duration-200 ${
                isDark ? 'text-gray-200 border-gray-600' : 'text-gray-600 border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-lg border`}
            />
            <Typography
              variant="caption"
              className={`text-sm ${
                username.length > PROFILE_CONSTANTS.MAX_USERNAME_LENGTH
                  ? 'text-red-400'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              {username.length}/{PROFILE_CONSTANTS.MAX_USERNAME_LENGTH}
            </Typography>
          </Box>

          
          <Box className="flex flex-col space-y-2">
            <Typography
              className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Bio
            </Typography>
            <TiptapEditor
              content={bio}
              onUpdate={handleEditorUpdate}
              setEditor={setEditor}
              isDark={isDark}
            />
            <Typography
              variant="caption"
              className={`text-sm ${
                bioLength > PROFILE_CONSTANTS.MAX_BIO_LENGTH
                  ? 'text-red-400'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              {bioLength}/{PROFILE_CONSTANTS.MAX_BIO_LENGTH}
            </Typography>
          </Box>
          <Box className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-sm ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600'
                  : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? <Spinner size="small" /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default EditProfileForm;