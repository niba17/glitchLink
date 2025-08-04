import { ToastProvider } from "@/components/toast/Toast";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import { AuthProvider } from "@/contexts/AuthContext"; // ✅

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
