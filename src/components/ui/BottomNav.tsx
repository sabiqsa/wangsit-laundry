"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV_BG = "#3D5A9E";

const TABS = [
  { href: "/", label: "Beranda", exact: true },
  { href: "/history", label: "Pesanan", exact: false },
  { href: "/promo", label: "Promo", exact: false },
  { href: "/profile", label: "Profil", exact: false },
];

const ICONS: Record<string, React.ReactNode> = {
  "/": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  "/history": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  ),
  "/promo": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  "/profile": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
};

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  if (pathname.startsWith("/admin")) return null;

  const getHref = (tab: typeof TABS[number]) =>
    tab.href === "/profile" ? (user ? "/profile" : "/auth/login") : tab.href;

  const isActive = (tab: typeof TABS[number]) =>
    tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

  return (
    <>
      {/* ── Mobile: bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16"
        style={{ background: NAV_BG }}
      >
        <div className="flex h-full" suppressHydrationWarning>
          {TABS.map((tab) => {
            const active = isActive(tab);
            const isProfile = tab.href === "/profile";
            return (
              <NextLink
                key={tab.href}
                href={getHref(tab)}
                className="flex-1 flex flex-col items-center justify-center gap-1"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: active ? "white" : "transparent",
                    color: active ? NAV_BG : "rgba(255,255,255,0.85)",
                  }}
                >
                  {isProfile && active && user ? (
                    <span className="text-sm font-bold" style={{ color: NAV_BG }}>
                      {user.name?.[0]?.toUpperCase() ?? "P"}
                    </span>
                  ) : (
                    ICONS[tab.href]
                  )}
                </div>
                <span
                  className="text-[10px] font-medium leading-none"
                  style={{ color: active ? "white" : "rgba(255,255,255,0.7)" }}
                >
                  {tab.label}
                </span>
              </NextLink>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop: top navbar ── */}
      <nav
        className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center px-8 gap-8"
        style={{ background: NAV_BG }}
      >
        {/* Logo */}
        <NextLink href="/" className="text-white font-bold text-lg tracking-tight shrink-0 mr-4">
          Wangsit Laundry
        </NextLink>

        {/* Nav items */}
        <div className="flex items-center gap-2 flex-1">
          {TABS.map((tab) => {
            const active = isActive(tab);
            return (
              <NextLink
                key={tab.href}
                href={getHref(tab)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer"
                style={{
                  background: active ? "white" : "transparent",
                  color: active ? NAV_BG : "rgba(255,255,255,0.85)",
                }}
              >
                <span style={{ color: active ? NAV_BG : "rgba(255,255,255,0.85)" }}>
                  {ICONS[tab.href]}
                </span>
                {tab.label}
              </NextLink>
            );
          })}
        </div>

        {/* User info / logout */}
        {user && (
          <div className="flex items-center gap-3 shrink-0" suppressHydrationWarning>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: NAV_BG }}>
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <span className="text-white text-sm font-medium">{user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white/70 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Keluar
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
