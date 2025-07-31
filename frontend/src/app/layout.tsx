import { ToastProvider } from "@/components/toast/Toast";
import "./globals.css";
import Nav from "@/components/layout/Nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
