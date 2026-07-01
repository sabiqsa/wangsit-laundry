'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginInput } from '@/schemas/auth.schema';

interface LoginFormProps {
  isAdmin?: boolean;
}

export function LoginForm({ isAdmin = false }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError('');
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Email atau password salah');
      return;
    }

    const session = await getSession();
    router.push(session?.user?.role === 'admin' ? '/admin' : '/');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2 rounded-xl">
          {error}
        </div>
      )}

      {/* Email/Username input */}
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Nomor Telepon, Username or Email"
          autoComplete="email"
          className="w-full px-5 py-3.5 rounded-full bg-white text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        {errors.email && (
          <p className="text-red-200 text-xs mt-1 ml-4">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password input */}
      <div className="relative">
        <input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full px-5 py-3.5 rounded-full bg-white text-gray-700 placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-blue-400 shadow-sm pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          aria-label="toggle password visibility"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        {errors.password && (
          <p className="text-red-200 text-xs mt-1 ml-4">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Log In button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-full font-bold text-white text-sm mt-1 flex items-center justify-center gap-2 disabled:opacity-70 transition-opacity"
        style={{ background: '#3D5A9E' }}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          'Log In'
        )}
      </button>

      {!isAdmin && <input type="hidden" name="isAdmin" value="false" />}
    </form>
  );
}
