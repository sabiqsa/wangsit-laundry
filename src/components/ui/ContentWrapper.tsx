"use client";

import { usePathname } from "next/navigation";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className={`pb-16 md:pb-0 ${isAdmin ? "" : "md:pt-16"}`}>
      {children}
    </div>
  );
}
