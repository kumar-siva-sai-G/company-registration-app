import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadLogo, uploadBanner } from '../api/apiService';
import { toast } from 'react-toastify';
import { Box, Button, Typography, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

const ImageUploader = ({ type, onUploadSuccess, currentImage }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const queryClient = useQueryClient();

  // Effect to update preview when currentImage prop changes
  React.useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const mutation = useMutation({
    mutationFn: type === 'logo' ? uploadLogo : uploadBanner,
    onSuccess: (data) => {
      onUploadSuccess(data.url);
      setPreview(data.url);
      toast.success(`${type} uploaded successfully!`);
      // Invalidate the companyProfile query to trigger a refetch on the dashboard
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
    },
    onError: (error) => {
      toast.error(`Failed to upload ${type}: ${error.response.data.message}`);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
  formData.append(type, file);
      mutation.mutate(formData);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess(null);
  };

  return (
    <Box sx={{ border: '2px dashed gray', padding: 2, borderRadius: 2, position: 'relative' }}>
      {preview ? (
        <>
          <img src={preview} alt={`${type} preview`} style={{ width: '100%', height: 'auto' }} />
          <IconButton
            onClick={handleRemove}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id={`upload-${type}`}
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor={`upload-${type}`}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
                cursor: 'pointer',
              }}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
              <Typography variant="body1">
                Browse photo or drag here
              </Typography>
            </Box>
          </label>
        </>
      )}
      {mutation.isPending && <Typography>Uploading...</Typography>}
    </Box>
  );
};

export default ImageUploader;