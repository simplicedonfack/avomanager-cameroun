import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEGESOFT",
  description: "Gestion du site agricole pilote de Missole-Banda",
};

export const viewport: Viewport = {
  themeColor: "#2b5d3a",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-vg-50 text-stone-800 antialiased">{children}</body>
    </html>
  );
}
