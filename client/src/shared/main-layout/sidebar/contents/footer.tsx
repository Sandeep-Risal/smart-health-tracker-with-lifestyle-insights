import { Logout } from "iconsax-react";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/shared/components/ui/sidebar";
import useProfile from "../hooks/useProfile.hook";
import { useProfileStore } from "../store/useProfile.store";

const UserInfo = ({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={image} />
        <AvatarFallback>
          {name.split(" ")[0]?.charAt(0).toUpperCase()}
          {name.split(" ")[1]?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p>{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};

const AppSidebarFooter = () => {
  const { loadingProfile, handleLogout } = useProfile();
  const { profileData } = useProfileStore();
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="h-full">
              <SidebarMenuButton className="focus-visible:ring-0 group-data-[collapsible=icon]:p-0!">
                <UserInfo
                  name={`${profileData?.firstName} ${profileData?.lastName}`}
                  email={profileData?.email}
                  image="https://github.com/shadcn.png"
                />
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="right"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem>
                <UserInfo
                  name={`${profileData?.firstName} ${profileData?.lastName}`}
                  email={profileData?.email}
                  image="https://github.com/shadcn.png"
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <Logout size={20} color="currentColor" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
