export const fetchMessages = async () => {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: 1,
      user: { username: 'jane_doe', avatarUrl: '/default-avatar.png' },
      lastMessage: 'Hey, how are you?',
      timestamp: '10:30 AM',
      unread: true,
    },
    {
      id: 2,
      user: { username: 'mark_smith', avatarUrl: '/default-avatar.png' },
      lastMessage: 'Let’s meet tomorrow!',
      timestamp: 'Yesterday',
      unread: false,
    },
    {
      id: 3,
      user: { username: 'emma_jones', avatarUrl: '/default-avatar.png' },
      lastMessage: 'Check out this link...',
      timestamp: 'Monday',
      unread: true,
    },
  ];
};