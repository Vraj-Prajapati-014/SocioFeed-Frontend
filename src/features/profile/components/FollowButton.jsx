import Button from '../../../components/common/Button/Button';

const FollowButton = ({ userId, isFollowing, followsYou, onFollowChange, isLoading }) => {
  if (isFollowing === null) {
    return null;
  }

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