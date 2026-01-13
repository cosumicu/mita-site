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

const updateMyProfile = async (formData: FormData): Promise<User> => {
  const response = await api.patch<User>("/profile/me/", formData);
  return response.data;
};

const userService = { getCurrentUser, getUserProfile, updateMyProfile };
export default userService;
