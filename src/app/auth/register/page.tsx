import { RegisterForm } from "@/features/auth/RegisterForm";
import NextLink from "next/link";

function WashingMachineSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 195"
      width="140"
      height="124"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="doorGlassReg" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#B8DEFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4A90D9" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <rect x="8" y="10" width="204" height="178" rx="14" fill="white" stroke="#d4d9e4" strokeWidth="2" />
      <rect x="8" y="10" width="204" height="52" rx="14" fill="#eef0f5" />
      <rect x="8" y="48" width="204" height="14" fill="#eef0f5" />
      <rect x="20" y="22" width="48" height="20" rx="5" fill="#dde1ea" />
      <rect x="24" y="26" width="40" height="12" rx="3" fill="#c8cdd8" />
      <circle cx="97" cy="34" r="13" fill="white" stroke="#5B7EC9" strokeWidth="2.5" />
      <circle cx="97" cy="34" r="5" fill="#5B7EC9" />
      <line x1="97" y1="21" x2="97" y2="28" stroke="#5B7EC9" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="119" y="20" width="60" height="26" rx="6" fill="#7BB3E8" />
      <rect x="122" y="23" width="54" height="20" rx="4" fill="#6AA8E0" opacity="0.85" />
      <line x1="126" y1="30" x2="148" y2="30" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <line x1="126" y1="37" x2="162" y2="37" stroke="white" strokeWidth="1.5" opacity="0.7" />
      <circle cx="193" cy="26" r="5" fill="#5B7EC9" />
      <circle cx="207" cy="26" r="5" fill="#8FAADC" />
      <circle cx="193" cy="39" r="5" fill="#8FAADC" />
      <circle cx="207" cy="39" r="5" fill="#5B7EC9" />
      <circle cx="110" cy="128" r="70" fill="#cacdd8" />
      <circle cx="110" cy="128" r="64" fill="#5B7EC9" stroke="#3D5A9E" strokeWidth="1.5" />
      <circle cx="110" cy="128" r="51" fill="#87CEEB" />
      <circle cx="110" cy="128" r="51" fill="url(#doorGlassReg)" />
      <circle cx="92" cy="110" r="17" fill="white" opacity="0.22" />
      <circle cx="97" cy="116" r="9" fill="white" opacity="0.14" />
      <rect x="20" y="178" width="180" height="7" rx="3.5" fill="#dde0e8" />
    </svg>
  );
}

function Bubble({ size, top, left, opacity }: { size: number; top: string; left: string; opacity: number }) {
  return (
    <div
      className="absolute rounded-full border border-white pointer-events-none"
      style={{ width: size, height: size, top, left, opacity, background: "rgba(255,255,255,0.15)" }}
    />
  );
}

function BigBubble({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <div
      className="rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35) 0%, rgba(200,225,255,0.15) 50%, rgba(135,206,235,0.1) 100%)",
        border: "1.5px solid rgba(255,255,255,0.45)",
        boxShadow:
          "inset -4px -4px 8px rgba(100,160,220,0.2), inset 4px 4px 8px rgba(255,255,255,0.3)",
        ...style,
      }}
    />
  );
}

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex flex-col pb-10 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #6B8FD4 0%, #87CEEB 100%)" }}
    >
      {/* Header with illustration */}
      <div className="relative flex items-center justify-between px-6 pt-12 pb-4">
        <Bubble size={20} top="12px" left="55%" opacity={0.55} />
        <Bubble size={30} top="8px" left="70%" opacity={0.45} />
        <Bubble size={16} top="50px" left="75%" opacity={0.35} />
        <Bubble size={12} top="30px" left="48%" opacity={0.4} />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Create Account
          </h1>
          <p className="text-white/85 text-sm mt-1 leading-snug max-w-45">
            Sign up to enjoy easy and fast laundry service
          </p>
        </div>

        <div className="shrink-0">
          <WashingMachineSVG />
        </div>
      </div>

      {/* Form */}
      <div className="w-full px-6 mt-2">
        <RegisterForm />

        <p className="text-center text-white/90 text-sm mt-5">
          Have an account?{" "}
          <NextLink href="/auth/login" className="font-bold text-white text-base hover:underline">
            Log In
          </NextLink>
        </p>
      </div>

      {/* Decorative bubbles */}
      <div className="relative flex justify-center items-end mt-6 h-52 overflow-hidden px-4">
        <div className="absolute" style={{ left: "8%", top: "20px" }}>
          <BigBubble size={90} />
        </div>
        <div className="absolute" style={{ left: "18%", top: "60px" }}>
          <BigBubble size={120} />
        </div>
        <div className="absolute" style={{ left: "5%", top: "80px" }}>
          <BigBubble size={70} />
        </div>
        <div className="absolute" style={{ right: "5%", top: "10px" }}>
          <BigBubble size={50} />
        </div>
        <div className="absolute" style={{ right: "15%", top: "30px" }}>
          <BigBubble size={30} />
        </div>
        <div className="absolute" style={{ right: "8%", top: "55px" }}>
          <BigBubble size={25} />
        </div>
        <div className="absolute" style={{ left: "55%", top: "0px" }}>
          <BigBubble size={160} />
        </div>
      </div>

      {/* Footer permission */}
      <div className="text-center px-6 mt-2">
        <p className="text-white/80 text-xs">We need permission for the service you use</p>
        <NextLink href="#" className="text-white font-semibold text-xs underline">
          Learn More
        </NextLink>
      </div>
    </div>
  );
}
