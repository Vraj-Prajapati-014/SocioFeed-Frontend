import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button/Button';

const MessageButton = ({ userId, username, disabled }) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate(`/messages/${userId}`, { state: { username } });
  };

  return (
    <Button
      onClick={handleMessageClick}
      size="small"
      disabled={disabled}
      className={`px-4 py-1 rounded-lg text-white font-medium transition-all duration-200 shadow-sm ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      Message
    </Button>
  );
};

export default MessageButton;