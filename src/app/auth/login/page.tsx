import { LoginForm } from '@/features/auth/LoginForm';
import NextLink from 'next/link';

function WashingMachineSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 220"
      width="220"
      height="220"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glassGrad" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#cce8f7" />
          <stop offset="100%" stopColor="#5b9fd4" />
        </radialGradient>
        <radialGradient id="glassShine" cx="35%" cy="30%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Body */}
      <rect
        x="12"
        y="10"
        width="196"
        height="200"
        rx="18"
        fill="white"
        stroke="#1e3a5f"
        strokeWidth="6"
      />

      {/* Control panel bg */}
      <rect
        x="12"
        y="10"
        width="196"
        height="62"
        rx="18"
        fill="#dce8f5"
        stroke="#1e3a5f"
        strokeWidth="6"
      />
      <rect x="12" y="55" width="196" height="17" fill="#dce8f5" />

      {/* Soap drawer */}
      <rect
        x="24"
        y="22"
        width="52"
        height="24"
        rx="6"
        fill="#b8cde0"
        stroke="#1e3a5f"
        strokeWidth="3.5"
      />
      <rect x="28" y="27" width="44" height="14" rx="4" fill="#9ab5cc" />

      {/* Knob */}
      <circle
        cx="108"
        cy="40"
        r="16"
        fill="white"
        stroke="#1e3a5f"
        strokeWidth="4"
      />
      <circle cx="108" cy="40" r="7" fill="#3b6fb5" />
      <line
        x1="108"
        y1="24"
        x2="108"
        y2="33"
        stroke="#3b6fb5"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Display */}
      <rect
        x="136"
        y="22"
        width="58"
        height="30"
        rx="7"
        fill="#5b9fd4"
        stroke="#1e3a5f"
        strokeWidth="3.5"
      />
      <rect x="140" y="27" width="50" height="20" rx="5" fill="#4a8fc4" />
      <line
        x1="144"
        y1="34"
        x2="168"
        y2="34"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      <line
        x1="144"
        y1="41"
        x2="184"
        y2="41"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* Door outer grey ring */}
      <circle
        cx="110"
        cy="148"
        r="70"
        fill="#b8cde0"
        stroke="#1e3a5f"
        strokeWidth="5"
      />

      {/* Door blue ring */}
      <circle
        cx="110"
        cy="148"
        r="60"
        fill="#3b6fb5"
        stroke="#1e3a5f"
        strokeWidth="4"
      />

      {/* Glass */}
      <circle
        cx="110"
        cy="148"
        r="48"
        fill="url(#glassGrad)"
        stroke="#1e3a5f"
        strokeWidth="3"
      />

      {/* Inner drum rings */}
      <circle
        cx="110"
        cy="148"
        r="36"
        fill="none"
        stroke="#2a5590"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle
        cx="110"
        cy="148"
        r="22"
        fill="none"
        stroke="#2a5590"
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* Shine */}
      <circle cx="110" cy="148" r="48" fill="url(#glassShine)" />

      {/* Bottom strip */}
      {/* <rect x="24" y="202" width="172" height="6" rx="3" fill="#b8cde0" /> */}

      {/* Filter cap */}
      <rect
        x="166"
        y="190"
        width="28"
        height="16"
        rx="5"
        fill="#dce8f5"
        stroke="#1e3a5f"
        strokeWidth="3"
      />
    </svg>
  );
}

function Bubble({
  size,
  top,
  left,
  opacity,
}: {
  size: number;
  top: string;
  left: string;
  opacity: number;
}) {
  return (
    <div
      className="absolute rounded-full border-2 border-white pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
        background: 'rgba(255,255,255,0.15)',
      }}
    />
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center pb-10"
      style={{
        background: 'linear-gradient(180deg, #6B8FD4 0%, #87CEEB 100%)',
      }}
    >
      {/* Header section with illustration */}
      <div className="relative w-full flex flex-col items-center pt-10 pb-4">
        <Bubble size={28} top="20px" left="18px" opacity={0.55} />
        <Bubble size={16} top="60px" left="28px" opacity={0.4} />
        <Bubble size={12} top="90px" left="55px" opacity={0.35} />
        <Bubble size={22} top="40px" left="calc(100% - 50px)" opacity={0.5} />
        <Bubble size={14} top="80px" left="calc(100% - 35px)" opacity={0.4} />
        <Bubble size={18} top="130px" left="calc(100% - 28px)" opacity={0.45} />

        <h1
          className="text-5xl font-bold text-center leading-tight mb-1 mt-2"
          style={{ fontFamily: "'Dancing Script', cursive", color: '#1a2b6d' }}
        >
          Wangsit
          <br />
          Laundry
        </h1>

        <div className="mt-2 drop-shadow-lg">
          <WashingMachineSVG />
        </div>
      </div>

      {/* Form section */}
      <div className="w-full max-w-sm px-8 mt-4 ">
        <LoginForm />

        <div className="text-center mt-3">
          <NextLink
            href="/auth/forgot-password"
            className="text-white text-sm hover:underline"
          >
            Forgot Password?
          </NextLink>
        </div>

        <p className="text-center text-white text-sm mt-2">
          Don&apos;t have an account?{' '}
          <NextLink
            href="/auth/register"
            className="font-bold text-white hover:underline text-base"
          >
            Sign Up
          </NextLink>
        </p>
      </div>

      {/* Guest section */}
      <div className="w-full max-w-sm px-8 mt-10 flex flex-col items-center">
        <p className="text-white text-sm mb-4">Pesan tanpa Log In</p>
        <div className="flex gap-4 w-full justify-center">
          <NextLink
            href="/order"
            className="flex-1 text-center py-3 rounded-full border-2 border-white text-white font-medium text-sm hover:bg-white hover:text-blue-700 transition-colors"
          >
            Place Order
          </NextLink>
          <NextLink
            href="/track"
            className="flex-1 text-center py-3 rounded-full border-2 border-white text-white font-medium text-sm hover:bg-white hover:text-blue-700 transition-colors"
          >
            Track Order
          </NextLink>
        </div>
      </div>
    </div>
  );
}
