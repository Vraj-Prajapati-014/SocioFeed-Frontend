export const getInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '1rem',
    marginBottom: '12px',
    '& fieldset': {
      borderColor: '#4b5563', // Neutral border color
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '1rem',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
    marginTop: '4px',
  },
  '& .MuiInputBase-input': {
    padding: '6px 0',
  },
  '.light &': {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#d1d5db', // Lighter border for light mode
      },
    },
    '& .MuiInputBase-input': {
      color: '#333333', // Dark color for light mode to ensure visibility
    },
  },
  '@media (max-width: 600px)': {
    '& .MuiOutlinedInput-root': {
      fontSize: '0.875rem',
      padding: '4px 10px',
      marginBottom: '10px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '0.7rem',
    },
  },
};
