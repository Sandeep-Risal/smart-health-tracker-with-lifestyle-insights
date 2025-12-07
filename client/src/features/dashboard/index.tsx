"use client";
import React from "react";
import { useProfileStore } from "@/src/shared/main-layout/sidebar/store/useProfile.store";

const DashboardContent = () => {
  const { profileData } = useProfileStore();
  return (
    <div>
      <p className="text-3xl">
        {" "}
        Welcome!{" "}
        <span className="font-bold">
          {profileData.first_name} {profileData.last_name}
        </span>
      </p>
    </div>
  );
};

export default DashboardContent;
