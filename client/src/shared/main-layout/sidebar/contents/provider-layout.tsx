"use client";
import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/src/shared/components/ui/sidebar";
import { AppSidebar } from "..";
import { QueryClient, QueryClientProvider } from "react-query";
import PageBreadCrumbs from "../../breadcrumbs";

const SidebarLayout = ({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
        cacheTime: 0,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex w-full">
          <AppSidebar />
          <main className="flex-1 shrink-0 p-4 bg-accent text-accent-foreground space-y-4">
            <SidebarTrigger />
            <PageBreadCrumbs />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default SidebarLayout;
