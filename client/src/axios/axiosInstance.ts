import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import { appConfig } from "@/src/config/app-config";
// import { constants } from "@/src/constants";
import { CookieKeys, HttpMethods } from "@/src/enums";
import { clearCookie } from "@/src/shared/lib/utils";
import { toast } from "sonner";
import { constants } from "../constants";

const { api } = appConfig;
// const { SESSION_EXPIRED, TIMEOUT } = constants.messages;

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: `${api.baseUrl}`,
  timeout: 60000,
});

export const clearAllSessionAndLocalStates = () => {
  toast.error(constants.messages.SESSION_EXPIRED, {
    id: "session",
  });

  clearCookie(CookieKeys.IS_LOGGED_IN);

  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
};

const refreshAuthLogic = (_failedRequest: any) => {
  return axiosInstance
    .post("/auth/refresh")
    .then(() => {
      return Promise.resolve();
    })
    .catch((err: any) => {
      clearAllSessionAndLocalStates();
      return Promise.reject(err);
    });
};

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  shouldRefresh: (error: any) => {
    let shouldRefresh = false;
    const responseData = error.response?.data;
    const responseStatus = error.response?.status;
    const errorCode = responseData?.code;
    // const rememberMe = getCookie(REMEMBER_ME);
    if (responseStatus === 403 && errorCode === 1006) {
      shouldRefresh = true;
    } else if (responseStatus === 401 && errorCode === 1005) {
      clearAllSessionAndLocalStates();
    }
    return shouldRefresh;
  },
});

const httpRequest = async (
  url: string,
  method: HttpMethods,
  data?: Record<string, any>,
  headers = {
    "Content-Type": "application/json",
  }
) => {
  try {
    const response = await axiosInstance[method](`${url}`, data, {
      headers,
    });
    return {
      ...(response?.data?.pagination && {
        pagination: response?.data?.pagination,
      }),
      data: response?.data,
    };
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      // toast.error(TIMEOUT, {
      //   id: "timeout",
      // });
    } else {
      error?.response?.status === 404
        ? (window.location.href = "/not-found")
        : error?.response?.status === 403 &&
          error?.response?.data?.code === 1010
        ? (window.location.href = "/forbidden")
        : null;

      throw error?.response?.data;
    }
  }
};

export default httpRequest;
