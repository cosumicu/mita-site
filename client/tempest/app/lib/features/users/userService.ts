import api from "../axiosInstance";
import { User } from "../../definitions";

const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/profile/me");
  return response.data;
};

const getUserProfile = async (userId: string) => {
  const response = await api.get<User>(`/profile/${userId}/`);
  return response.data;
};

const userService = { getCurrentUser, getUserProfile };
export default userService;
