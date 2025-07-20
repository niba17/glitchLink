import "./globals.css";
import Nav from "@/components/layout/Nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-stone-200 overflow-hidden">
        <Nav />
        {children}
      </body>
    </html>
  );
}
