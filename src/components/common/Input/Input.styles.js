export const getInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#3b82f6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ef4444',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
    '&.Mui-error': {
      color: '#ef4444',
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#6b7280',
    '&.Mui-error': {
      color: '#ef4444',
    },
  },
  '.dark &': {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#4b5563',
      },
      '&:hover fieldset': {
        borderColor: '#60a5fa',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#60a5fa',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#9ca3af',
      '&.Mui-focused': {
        color: '#60a5fa',
      },
    },
    '& .MuiFormHelperText-root': {
      color: '#9ca3af',
    },
    '& .MuiInputBase-input': {
      color: '#e5e7eb',
    },
  },
};
