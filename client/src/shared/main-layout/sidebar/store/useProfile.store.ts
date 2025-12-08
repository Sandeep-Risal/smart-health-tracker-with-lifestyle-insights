import { create } from "zustand";

interface IProfileData {
  //   image: string;
  id: string;
  username: string;
  dob: string;
  gender: string;
  email: string;
  first_name: string;
  last_name: string;
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
    first_name: "",
    last_name: "",
    dob:"",
    gender:""
  },
  setProfileData: (data: IProfileData) => {
    set(() => ({ profileData: data }));
  },
}));
