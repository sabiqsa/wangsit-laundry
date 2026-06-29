import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Block Google OAuth for admin accounts
      if (account?.provider === "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser?.role === "admin") return false;

        // Create or update Google user
        if (!dbUser) {
          await User.create({
            name: user.name ?? "User",
            email: user.email ?? "",
            googleId: account.providerAccountId,
            role: "client",
            image: user.image ?? undefined,
          });
        } else if (!dbUser.googleId) {
          await User.findByIdAndUpdate(dbUser._id, {
            googleId: account.providerAccountId,
            image: user.image,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: "admin" | "client" }).role;
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) token.phone = dbUser.phone;
      }

      if (!token.role) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.phone = dbUser.phone;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});
