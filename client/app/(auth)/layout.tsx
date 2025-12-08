"use client";

import Image from "next/image";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthImg from "@/public/auth-img.svg";

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
      <div className="grid grid-cols-2">
        <div>
          <Image
            src={AuthImg}
            alt="Auth Image"
            className="h-full w-full object-cover"
            width={100}
            height={100}
            quality={100}
          />
        </div>
        <div className="flex flex-col items-center justify-center h-screen text-black w-full">
          {/* <Image
            src={Logo}
            alt="Logo"
            className="size-40"
            width={100}
            height={100}
            quality={100}
          /> */}
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
