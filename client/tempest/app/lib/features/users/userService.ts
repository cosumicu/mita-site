import api from "../axiosInstance";
import { User } from "../../definitions";

const BASE_USER_URL = `${process.env.NEXT_PUBLIC_API_HOST}/profile`;
const GET_CURRENT_USER_URL = `${BASE_USER_URL}/me`;

const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>(GET_CURRENT_USER_URL);
  return response.data;
};

const getUserProfile = async (userId: string) => {
  const response = await api.get<User>(`${BASE_USER_URL}/${userId}/`);
  return response.data;
};

const userService = { getCurrentUser, getUserProfile };
export default userService;
