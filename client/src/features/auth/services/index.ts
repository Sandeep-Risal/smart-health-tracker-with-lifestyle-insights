import httpRequest from "@/src/axios/axiosInstance";
import { ILoginForm } from "../interfaces";
import { HttpMethods } from "@/src/enums";

const login = (data: ILoginForm) => {
  return httpRequest("/auth/login", HttpMethods.POST, data);
};

const getProfile = () => {
  return httpRequest("/profile", HttpMethods.GET);
};

const logout = () => {
  return httpRequest("/auth/logout", HttpMethods.POST);
};

export { login, getProfile, logout };
