import axios from "axios";

const authUrl = import.meta.env.VITE_BE_URL || "http://localhost:8080";

const authAPI = axios.create({
  baseURL: authUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await authAPI.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Register failed";
  }
};

// Đăng nhập
export const login = async (credentials) => {
  try {
    const response = await authAPI.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// Làm mới access token từ refresh token
// export const refreshToken = async () => {
//   try {
//     const response = await authAPI.post("/auth/refresh");
//     return response.data;
//   } catch (error) {
//     throw error.response?.data?.message || "Token refresh failed";
//   }
// };

// Đăng xuất (xoá refresh token ở backend)
export const logout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user", user.id);

    if (!user || !user.id) throw new Error("User not found");

    const response = await authAPI.post("/auth/logout", {
      userId: user.id,
    });
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error.response?.data?.message || "Logout failed";
  }
};

export const changePassword = async ({ userId, oldPassword, newPassword }) => {
  try {
    const response = await authAPI.post("/auth/change-password", {
      userId,
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Change password failed";
  }
};

// Xác thực email
export const verifyEmail = async (token) => {
  try {
    const response = await authAPI.get(`/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Email verification failed";
  }
};

export default authAPI;
