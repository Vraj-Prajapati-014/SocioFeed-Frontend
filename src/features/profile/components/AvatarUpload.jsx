import React, { useState, useRef, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useUpdateAvatar } from '../hook/useUpdateAvatar';
import { showToast } from '../../../utils/helpers/toast';
import ThemeContext from '../../../utils/context/ThemeContext';
import Card from '../../../components/common/Card/Card';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';

const AvatarUpload = ({ onSuccess }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const { mutate: updateAvatar, isLoading } = useUpdateAvatar();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], selectedFile.name, { type: selectedFile.type }));
      }, selectedFile.type);
    });
  };

  const handleUpload = async () => {
    let fileToUpload = selectedFile;
    if (completedCrop && imgRef.current) {
      fileToUpload = await getCroppedImg(imgRef.current, completedCrop);
    }
    const formData = new FormData();
    formData.append('avatar', fileToUpload);
    updateAvatar(formData, {
      onSuccess: () => {
        showToast('Avatar updated successfully', 'success');
        setSelectedFile(null);
        setPreview(null);
        onSuccess();
      },
      onError: (error) => {
        showToast(error.message || 'Failed to update avatar', 'error');
      },
    });
  };

  return (
   <Card
  elevation={2}
  className={`w-full max-w-md mx-auto pt-2 px-4 pb-4 sm:pt-3 sm:px-6 sm:pb-6 rounded-xl shadow-lg ${
    isDark ? 'bg-gray-800' : 'bg-white'
  }`}
>
      <Box className="flex flex-col space-y-4">
        <Typography
          variant="h6"
          className={isDark ? 'text-gray-200' : 'text-gray-800'}
        >
          Update Avatar
        </Typography>
        <Typography
          className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          Max 5MB
        </Typography>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`block w-full text-sm bg-transparent transition-all duration-200 ${
            isDark ? 'text-gray-200 border-gray-600' : 'text-gray-600 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 p-3 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer ${
            isDark
              ? 'file:bg-blue-600 file:text-white file:hover:bg-blue-700'
              : 'file:bg-blue-500 file:text-white file:hover:bg-blue-600'
          }`}
        />
        {preview && (
          <Box className="space-y-4">
            <Box className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                className="relative"
              >
                <img
                  ref={imgRef}
                  src={preview}
                  alt="Preview"
                  className={`max-w-full h-48 object-contain rounded-full border-2 ${
                    isDark ? 'border-gray-600' : 'border-gray-300'
                  } shadow-sm`}
                />
              </ReactCrop>
            </Box>
            <Box className="flex justify-center pt-4">
              <Button
                onClick={handleUpload}
                disabled={isLoading || !selectedFile}
                className={`px-8 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-sm ${
                  isDark
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600'
                    : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? <Spinner size="small" /> : 'Upload Avatar'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default AvatarUpload;