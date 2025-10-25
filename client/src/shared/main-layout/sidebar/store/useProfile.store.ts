import { create } from "zustand";

interface IProfileData {
  //   image: string;
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IProfileStore {
  profileData: IProfileData;
  setProfileData: (data: IProfileData) => void;
}

export const useProfileStore = create<IProfileStore>((set) => ({
  profileData: {
    id: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  },
  setProfileData: (data: IProfileData) => {
    set(() => ({ profileData: data }));
  },
}));
