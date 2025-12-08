import httpRequest from "@/src/axios/axiosInstance";
import { ILoginForm, IRegisterForm } from "../interfaces";
import { HttpMethods } from "@/src/enums";
import { deleteCookie } from "cookies-next";

const login = (data: ILoginForm) => {
  return httpRequest("/auth/login", HttpMethods.POST, data);
};

const register = (data: IRegisterForm) => {
  return httpRequest("/auth/register", HttpMethods.POST, data);
};

const getProfile = () => {
  return httpRequest("/api/profile", HttpMethods.GET);
};

const logout = () => {
  return httpRequest("/auth/logout", HttpMethods.POST);
};

export { login, getProfile, logout, register };
