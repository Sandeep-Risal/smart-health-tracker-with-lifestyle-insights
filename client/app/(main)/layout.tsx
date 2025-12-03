import type { Metadata } from "next";
import { cookies } from "next/headers";
import SidebarLayout from "@/src/shared/main-layout/sidebar/contents/provider-layout";

export const metadata: Metadata = {
  title: "Health Tracker",
  description: "Health Tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return <SidebarLayout defaultOpen={defaultOpen}>{children}</SidebarLayout>;
}
