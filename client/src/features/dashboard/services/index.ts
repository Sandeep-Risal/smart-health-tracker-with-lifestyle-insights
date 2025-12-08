import httpRequest from "@/src/axios/axiosInstance";
import { HttpMethods } from "@/src/enums";

export const getTrend = () => {
  return httpRequest("/api/trends", HttpMethods.GET);
};
