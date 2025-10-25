import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/shared/components/ui/sidebar";

import AppSidebarFooter from "./contents/footer";
import { sidebarItems } from "./sidebar-items";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      {/* Content */}
      <SidebarContent>
        {sidebarItems.map((item) => (
          <SidebarGroup key={item?.group}>
            <SidebarGroupLabel>{item?.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item?.childrens?.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={item.href === pathname}
                    >
                      <Link href={item.href}>
                        <item.icon size={24} color="currentColor" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <AppSidebarFooter />
    </Sidebar>
  );
}
