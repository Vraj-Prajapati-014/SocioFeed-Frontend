// import React, { useState } from 'react';
// import { Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useFollow } from '../hook/useFollow';

// const FollowButton = ({ userId, isFollowing, followsYou, onFollowChange }) => {
//   const { follow } = useFollow();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFollowToggle = async () => {
//     try {
//       if (isFollowing) {
//         navigate(`/messages/${userId}`);
//       } else {
//         setIsLoading(true);
//         await follow(userId, onFollowChange); // Trigger parent refresh
//       }
//     } catch (error) {
//       console.error('Error toggling follow:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isFollowing === null) {
//     return null;
//   }

//   let buttonLabel;
//   if (isFollowing) {
//     buttonLabel = 'Message';
//   } else if (followsYou) {
//     buttonLabel = 'Follow Back';
//   } else {
//     buttonLabel = 'Follow';
//   }

//   return (
//     <Button
//       variant={isFollowing ? 'outlined' : 'contained'}
//       size="small"
//       onClick={handleFollowToggle}
//       disabled={isLoading}
//       className={
//         isFollowing
//           ? 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
//           : 'bg-blue-500 text-white hover:bg-blue-600'
//       }
//     >
//       {isLoading ? 'Loading...' : buttonLabel}
//     </Button>
//   );
// };

// export default FollowButton;

import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFollow } from '../hook/useFollow';
import MessageButton from '../../messages/components/MessageButton';

const FollowButton = ({ userId, isFollowing, followsYou, onFollowChange }) => {
  const { follow } = useFollow();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        navigate(`/messages/${userId}`);
      } else {
        setIsLoading(true);
        await follow(userId, onFollowChange);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFollowing === null) {
    return null;
  }

  let buttonLabel;
  if (isFollowing) {
    buttonLabel = 'Message';
  } else if (followsYou) {
    buttonLabel = 'Follow Back';
  } else {
    buttonLabel = 'Follow';
  }

  return isFollowing ? (
    <MessageButton userId={userId} username={userId} /> // Username will be fetched in MessageThread
  ) : (
    <Button
      variant="contained"
      size="small"
      onClick={handleFollowToggle}
      disabled={isLoading}
      className="bg-blue-500 text-white hover:bg-blue-600"
    >
      {isLoading ? 'Loading...' : buttonLabel}
    </Button>
  );
};

export default FollowButton;