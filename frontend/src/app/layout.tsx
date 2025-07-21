import "./globals.css";
import Nav from "@/components/layout/Nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-stone-200">
        <Nav />
        {children}
      </body>
    </html>
  );
}
