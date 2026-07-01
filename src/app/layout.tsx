import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { BottomNav } from "@/components/ui/BottomNav";
import { ContentWrapper } from "@/components/ui/ContentWrapper";
import "./globals.css";

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
          <BottomNav />
          <ContentWrapper>{children}</ContentWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
