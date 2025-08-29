"use client";

import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { useTokenWatcher } from "@/utils/authWatcher";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: any) {
  useTokenWatcher(); // token watcher otomatis jalan

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
