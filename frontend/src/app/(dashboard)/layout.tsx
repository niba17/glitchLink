// app/layout.tsx
import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "glitchLink",
  description: "Shorten your links with analytics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
