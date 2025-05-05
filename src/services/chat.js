import axios from "axios";

const authUrl = import.meta.env.VITE_BE_URL || "http://localhost:8080";
const chatAPI = axios.create({
  baseURL: authUrl + "/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

export const sendMessage = async ({ receiverId, content, isAdmin }) => {
  try {
    // Lấy senderId từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);

    // Kiểm tra nếu user tồn tại và có _id
    if (!user || !user.id) {
      throw new Error("Không tìm thấy senderId trong localStorage");
    }

    const senderId = user.id;
    console.log("Sender ID:", senderId);

    const res = await chatAPI.post("/chat/send", {
      senderId,
      receiverId,
      content,
      isAdmin,
    });

    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi gửi tin nhắn:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getChatHistory = async (userId) => {
  try {
    const res = await chatAPI.get(`/chat/${userId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy lịch sử chat:",
      error.response?.data || error.message
    );
    throw error;
  }
};
