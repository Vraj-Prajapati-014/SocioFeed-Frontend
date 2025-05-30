export const getButtonStyles = (variant, size, disabled) => {
  const baseStyles = {
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#d1d5db' : '#3b82f6',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: disabled ? '#d1d5db' : '#2563eb',
      },
    },
    secondary: {
      backgroundColor: disabled ? '#d1d5db' : '#6b7280',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: disabled ? '#d1d5db' : '#4b5563',
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: disabled ? '#d1d5db' : '#3b82f6',
      border: `1px solid ${disabled ? '#d1d5db' : '#3b82f6'}`,
      '&:hover': {
        backgroundColor: disabled ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
      },
    },
  };

  const sizeStyles = {
    small: {
      padding: '4px 8px',
      fontSize: '0.875rem',
    },
    medium: {
      padding: '6px 12px',
      fontSize: '1rem',
    },
    large: {
      padding: '8px 16px',
      fontSize: '1.125rem',
    },
  };

  return {
    ...baseStyles,
    ...(variantStyles[variant] || variantStyles.primary),
    ...(sizeStyles[size] || sizeStyles.medium),
    opacity: disabled ? 0.7 : 1,
  };
};
