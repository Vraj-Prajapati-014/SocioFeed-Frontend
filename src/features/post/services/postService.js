const mockPosts = Array.from({ length: 20 }, (_, index) => ({
  id: `${index + 1}`,
  author: {
    username: `user_${index + 1}`,
    avatarUrl: '/default-avatar.png',
  },
  content: `This is a sample post #${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  images: [
    'https://via.placeholder.com/600x400?text=Image+1',
    'https://via.placeholder.com/600x400?text=Image+2',
  ],
  likesCount: Math.floor(Math.random() * 100),
  commentsCount: Math.floor(Math.random() * 20),
}));

export const fetchPosts = async ({ page = 1, limit = 10 }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedPosts = mockPosts.slice(start, end);

  return {
    posts: paginatedPosts,
    pagination: {
      total: mockPosts.length,
      page,
      limit,
      totalPages: Math.ceil(mockPosts.length / limit),
    },
  };
};
