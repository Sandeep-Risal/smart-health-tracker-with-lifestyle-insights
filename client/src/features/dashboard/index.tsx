"use client";
import React from "react";
import { useProfileStore } from "@/src/shared/main-layout/sidebar/store/useProfile.store";

const DashboardContent = () => {
  const { profileData } = useProfileStore();
  return (
    <div>
      Welcome!{" "}
      <span className="font-bold">
        {profileData.firstName} {profileData.lastName}
      </span>
    </div>
  );
};

export default DashboardContent;
