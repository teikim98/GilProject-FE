import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Auth 토큰 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 댓글 목록 조회
export const getComments = async (postId: number) => {
  try {
    const response = await api.get(`/posts/${postId}/replies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// 댓글 작성
export const createComment = async (postId: number, content: string) => {
  try {
    await api.post(`/posts/${postId}/replies`, {
      content: content,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// 댓글 삭제 - replyId를 명시적으로 받아서 사용
export const deleteComment = async (postId: number, replyId: number) => {
  if (!replyId) {
    throw new Error("Reply ID is required");
  }
  try {
    await api.delete(`/posts/${postId}/replies/${replyId}`);
  } catch (error) {
    console.error(`Error deleting comment ${replyId}:`, error);
    throw error;
  }
};

// 댓글 좋아요 토글 - replyId를 명시적으로 받아서 사용
export const toggleCommentLike = async (postId: number, replyId: number) => {
  if (!replyId) {
    throw new Error("Reply ID is required");
  }
  try {
    await api.post(`/posts/${postId}/replies/${replyId}/likes`);
  } catch (error) {
    console.error(`Error toggling like for comment ${replyId}:`, error);
    throw error;
  }
};
