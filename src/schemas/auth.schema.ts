import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama terlalu panjang"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
