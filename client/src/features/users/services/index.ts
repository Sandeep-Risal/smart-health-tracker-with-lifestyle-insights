import httpRequest from "@/src/axios/axiosInstance";
import { HttpMethods } from "@/src/enums";

const getUsers = async (page: number, limit: number, search?: string) => {
  return httpRequest("/users", HttpMethods.GET, {
    params: {
      page,
      limit,
      ...(search && { search }),
    },
  });
};

export { getUsers };
