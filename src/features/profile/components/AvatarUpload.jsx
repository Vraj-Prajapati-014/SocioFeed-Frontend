import React, { useState, useRef } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useUpdateAvatar } from '../hook/useUpdateAvatar';
import { showToast } from '../../../utils/helpers/toast';

const AvatarUpload = ({ onSuccess }) => {
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
    <Box className="space-y-4">
      <Typography variant="h6">Update Avatar</Typography>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {preview && (
        <Box>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img ref={imgRef} src={preview} alt="Preview" style={{ maxWidth: '100%' }} />
          </ReactCrop>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isLoading || !selectedFile}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Uploading...' : 'Upload Avatar'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AvatarUpload;