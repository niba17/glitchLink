"use client";

import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Navbar di atas semua halaman */}
      <Navbar />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
