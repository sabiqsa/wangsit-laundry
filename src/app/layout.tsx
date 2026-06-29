import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Wangsit Laundry",
  description: "Aplikasi laundry terpercaya - Cuci, Setrika, dan Layanan Laundry Profesional",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wangsit Laundry",
  },
};

export const viewport: Viewport = {
  themeColor: "#0071e3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
