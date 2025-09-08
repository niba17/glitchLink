"use client";

import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useTokenWatcher } from "@/utils/authWatcher";
import NavbarContainer from "@/components/layouts/navbars/containers/NavbarContainer";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: any) {
  useTokenWatcher(); // token watcher otomatis jalan

  return (
    <QueryClientProvider client={queryClient}>
      <NavbarContainer />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
