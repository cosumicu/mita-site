import axios from "../axiosInstance";
import { RegisterData, ActivateData, LoginData } from "../../definitions";

const REGISTER_URL = `${process.env.NEXT_PUBLIC_API_HOST}/auth/users/`;
const ACTIVATE_URL = `${process.env.NEXT_PUBLIC_API_HOST}/auth/users/activation/`;
const LOGIN_URL = `${process.env.NEXT_PUBLIC_API_HOST}/auth/jwt/create/`;
const LOGOUT_URL = `${process.env.NEXT_PUBLIC_API_HOST}/auth/jwt/logout/`;

const register = async (userData: RegisterData): Promise<void> => {
  await axios.post<void>(REGISTER_URL, userData);
};

const activate = async (userData: ActivateData): Promise<void> => {
  await axios.post<void>(ACTIVATE_URL, userData);
};

const login = async (userData: LoginData): Promise<void> => {
  await axios.post<void>(LOGIN_URL, userData, {
    withCredentials: true,
  });
};

const logout = async (): Promise<void> => {
  await axios.post<void>(LOGOUT_URL, {
    withCredentials: true,
  });
};

const authService = { register, activate, login, logout };
export default authService;
