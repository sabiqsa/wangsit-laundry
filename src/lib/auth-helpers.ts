import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "admin") redirect("/");
  return user;
}

export async function requireClient() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "client") redirect("/admin");
  return user;
}
