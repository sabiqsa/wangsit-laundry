"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import Image from "next/image";

function MenuRow({
  icon,
  label,
  onClick,
  href,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}) {
  const cls = "flex items-center gap-4 px-4 py-4 w-full text-left transition-colors hover:bg-gray-50";
  const textColor = danger ? "#ef4444" : "#374151";

  const inner = (
    <>
      <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ color: danger ? "#ef4444" : "#5B7EC9" }}>
        {icon}
      </div>
      <span className="text-sm font-medium" style={{ color: textColor }}>{label}</span>
    </>
  );

  if (href) return <NextLink href={href} className={cls}>{inner}</NextLink>;
  return <button className={cls} onClick={onClick}>{inner}</button>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 mt-6">
      <h2 className="text-base font-bold text-gray-800 mb-3">{title}</h2>
      <div className="rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 bg-white">
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  const user = session?.user;
  const initials = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero header */}
      <div
        className="relative pt-6 pb-10 flex flex-col items-center"
        style={{ background: "linear-gradient(160deg, #6B8FD4 0%, #87CEEB 100%)" }}
      >
        {/* Points badge */}
        <div className="absolute top-5 left-4 flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#F59E0B" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span className="text-white text-sm font-semibold">0 Poin</span>
        </div>

        {/* Avatar */}
        <div className="relative mt-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blue-200 flex items-center justify-center">
            {user?.image ? (
              <Image src={user.image} alt={user.name ?? ""} width={96} height={96} className="object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{initials}</span>
            )}
          </div>
          {/* Camera icon */}
          <div
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
            style={{ background: "#3D5A9E" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Name & phone */}
        <p className="text-white font-bold text-xl mt-3">{user?.name ?? "-"}</p>
        <p className="text-white/85 text-sm mt-0.5">{user?.phone ?? user?.email ?? "-"}</p>
      </div>

      {/* Body */}
      <div className="-mt-4">
        {/* Alamat Saya */}
        <div className="px-4 mt-2">
          <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 flex items-start justify-between shadow-sm">
            <div>
              <p className="font-bold text-sm" style={{ color: "#3D5A9E" }}>Alamat Saya</p>
              <p className="text-sm text-gray-600 mt-1 leading-snug">
                {user ? "Belum ada alamat tersimpan" : "-"}
              </p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        {/* Pembayaran */}
        <Section title="Pembayaran">
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#EEF2FF" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7EC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Saldo Wallet</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">Rp. 0</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>

          <div className="flex items-center gap-4 px-4 py-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#EEF2FF" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7EC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M2 10h20"/>
                <path d="M6 15h.01M10 15h4"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Metode Pembayaran</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">QRIS, Bayar di Toko</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </Section>

        {/* Pengaturan */}
        <Section title="Pengaturan">
          <MenuRow
            href="#"
            label="Notifikasi"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            }
          />
          <MenuRow
            href="#"
            label="Ubah Password"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
          />
          <MenuRow
            href="#"
            label="Bantuan & FAQ"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            }
          />
          <MenuRow
            label="Keluar"
            danger
            onClick={() => signOut({ callbackUrl: "/" })}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            }
          />
        </Section>
      </div>
    </div>
  );
}
