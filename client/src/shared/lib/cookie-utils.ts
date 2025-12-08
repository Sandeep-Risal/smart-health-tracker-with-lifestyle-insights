import { CookieKeys } from "@/src/enums";
import { getCookie } from "cookies-next";

export const getAccessToken = () => {
  const token: any = getCookie(CookieKeys.ACCESS_TOKEN);
  return token;
};
