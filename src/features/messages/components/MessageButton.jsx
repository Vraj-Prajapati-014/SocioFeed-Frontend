import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button/Button';

const MessageButton = ({ userId, username }) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate(`/messages/${userId}`, { state: { username } });
  };

  return (
    <Button
      onClick={handleMessageClick}
      size="small"
      className="bg-green-500 text-white hover:bg-green-600"
    >
      Message
    </Button>
  );
};

export default MessageButton;