import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Party — AIRA Yacht Night",
  description: "App de registro para AIRA Party · Yate Majestic · Represa Guatapé",
  openGraph: {
    title: "AIRA Party Yacht Night",
    description: "Reserva tu puesto en el Yate Majestic · Represa Guatapé",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#004fff",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={figtree.variable}>{children}</body>
    </html>
  );
}
