import { useProfileStore } from "../store/useProfile.store";
import { useMutation, useQuery } from "react-query";
import { getProfile, logout } from "@/src/features/auth/services";
import { useRouter } from "next/navigation";
import { showToast } from "@/src/shared/lib/toast-utils";
import { CookieKeys, TOAST_TYPES } from "@/src/enums";
import { constants } from "@/src/constants";
import { clearCookie } from "@/src/shared/lib/utils";
import { deleteCookie } from "cookies-next";
import { Cookie } from "next/font/google";

const useProfile = () => {
  const router = useRouter();
  const { setProfileData } = useProfileStore();

  const { isLoading: loadingProfile } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
    onSuccess: (data) => {
      setProfileData(data?.data?.data);
    },
  });

  // const logoutMutation = useMutation({
  //   mutationFn: logout,
  //   onSuccess: (data) => {
  //     showToast(TOAST_TYPES.success, data?.data?.message);
  //     clearCookie(CookieKeys.IS_LOGGED_IN);
  //     router.push("/login");
  //   },
  //   onError: (error) => {
  //     showToast(TOAST_TYPES.error, constants?.messages?.SOMETHING_WENT_WRONG);
  //   },
  // });

  const handleLogout = () => {
    // logoutMutation.mutate();
    deleteCookie(CookieKeys.IS_LOGGED_IN);
    deleteCookie(CookieKeys.IS_LOGGED_IN);
    showToast(TOAST_TYPES.success, "Logout Successful");
    router.push("/login");
  };

  return { loadingProfile, handleLogout };
};

export default useProfile;
