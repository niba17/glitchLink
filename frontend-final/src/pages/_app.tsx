// src/pages/_app.tsx
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useTokenWatcher } from "@/utils/authWatcher";
import Navbar02Container from "@/components/layouts/navbars/navbar-02/containers/Navbar02Container";
import Footer05Page from "@/components/layouts/footers/footer-05/footer-05";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: any) {
  useTokenWatcher();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar02Container />
      <Component {...pageProps} />
      <Footer05Page />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
