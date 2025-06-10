import Button from '../../../components/common/Button/Button';
import { useNavigate } from 'react-router-dom';

const FollowButton = ({ userId, username, isFollowing, followsYou, onFollowChange, isLoading, showMessageButton = false }) => {
  const navigate = useNavigate();

  if (isFollowing === null) {
    return null;
  }

  // In SearchResults, if users follow each other, show a Message button instead
  if (showMessageButton && isFollowing && followsYou) {
    return (
      <Button
        onClick={() => navigate(`/messages/${userId}`, { state: { username } })}
        size="small"
        className="px-4 py-1 rounded-lg text-white font-medium transition-all duration-200 shadow-sm bg-green-500 hover:bg-green-600"
      >
        Message
      </Button>
    );
  }

  // Determine the button label based on follow relationship
  let buttonLabel;
  if (isFollowing) {
    buttonLabel = 'Unfollow';
  } else if (followsYou) {
    buttonLabel = 'Follow Back';
  } else {
    buttonLabel = 'Follow';
  }

  return (
    <Button
      onClick={onFollowChange}
      disabled={isLoading}
      size="small"
      className={`px-4 py-1 rounded-lg font-medium transition-all duration-200 shadow-sm ${
        isFollowing
          ? 'text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          : isLoading
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {isLoading ? 'Loading...' : buttonLabel}
    </Button>
  );
};

export default FollowButton;