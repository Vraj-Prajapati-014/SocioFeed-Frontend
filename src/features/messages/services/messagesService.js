import axiosInstance from "../../auth/slices/axiosInstance";

export const fetchConversations = async () => {
  try {
    const response = await axiosInstance.get('/chat/conversations');
    console.log('messagesService - Raw API response:', response.data);
    console.log('messagesService - Returning conversations:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('messagesService - Error fetching conversations:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const fetchMessages = async (otherUserId) => {
  try {
    const response = await axiosInstance.get(`/chat/messages/${otherUserId}`);
    console.log('messagesService - Raw API response for messages:', response.data);
    console.log('messagesService - Returning messages:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('messagesService - Error fetching messages:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const sendMessage = async (receiverId, content) => {
  try {
    const response = await axiosInstance.post(`/chat/messages/${receiverId}`, { content });
    console.log('messagesService - Sent message response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('messagesService - Error sending message:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await axiosInstance.delete(`/chat/messages/${messageId}`);
    console.log('messagesService - Delete message response:', response.data);
    return response.data;
  } catch (error) {
    console.error('messagesService - Error deleting message:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};