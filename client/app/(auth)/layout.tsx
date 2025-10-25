"use client";

import { QueryClient, QueryClientProvider } from "react-query";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <div className="flex flex-col items-center justify-center h-screen">
        {children}
      </div>
    </QueryClientProvider>
  );
}
