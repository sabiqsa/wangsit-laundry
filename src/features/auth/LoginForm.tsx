"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { loginSchema, LoginInput } from "@/schemas/auth.schema";

interface LoginFormProps {
  isAdmin?: boolean;
}

export function LoginForm({ isAdmin = false }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah");
      return;
    }

    const session = await getSession();
    router.push(session?.user?.role === "admin" ? "/admin" : "/");
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        {...register("email")}
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        autoComplete="email"
      />

      <TextField
        {...register("password")}
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : "Masuk"}
      </Button>

      {!isAdmin && (
        <>
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              atau
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={isGoogleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            Masuk dengan Google
          </Button>
        </>
      )}
    </Box>
  );
}
