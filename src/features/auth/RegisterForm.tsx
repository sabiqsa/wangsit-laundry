"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";

function IconPerson() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function InputField({
  icon,
  error,
  children,
}: {
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 bg-white/90 rounded-full px-4 py-3 shadow-sm">
        {icon}
        {children}
      </div>
      {error && <p className="text-red-200 text-xs mt-1 ml-4">{error}</p>}
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Registrasi gagal");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };

  if (success) {
    return (
      <div className="bg-green-100 border border-green-300 text-green-700 text-sm px-4 py-3 rounded-xl text-center">
        Registrasi berhasil! Mengalihkan ke halaman login...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-xl">
          {error}
        </div>
      )}

      <InputField icon={<IconPerson />} error={errors.name?.message}>
        <input
          {...register("name")}
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
        />
      </InputField>

      <InputField icon={<IconEmail />} error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email address"
          autoComplete="email"
          className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
        />
      </InputField>

      <InputField icon={<IconPhone />} error={errors.phone?.message}>
        <input
          {...register("phone")}
          type="tel"
          placeholder="Phone number"
          autoComplete="tel"
          className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
        />
      </InputField>

      <InputField icon={<IconLock />} error={errors.password?.message}>
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="text-gray-400 text-xs hover:text-gray-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </InputField>

      <InputField icon={<IconLock />} error={errors.confirmPassword?.message}>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-sm outline-none"
        />
      </InputField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-full font-bold text-white text-sm mt-1 flex items-center justify-center disabled:opacity-70 transition-opacity"
        style={{ background: "#3D5A9E" }}
      >
        {isSubmitting ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Sign Up"}
      </button>
    </form>
  );
}
