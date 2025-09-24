import NextAuth from "next-auth";
import { mockAuthDB, getOrCreateUser } from "@/lib/db/mockAuth";
import { setLastMagicLink } from "@/lib/dev/lastLink";
import { randomBytes } from "crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "email",
      name: "Email",
      type: "email",
      async sendVerificationRequest({ identifier }) {
        const token = randomBytes(16).toString("hex");
        const expires = Date.now() + 15 * 60 * 1000;
        mockAuthDB.verificationTokens.set(token, { identifier, token, expires });
        const devLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/dev?token=${token}`;
        setLastMagicLink(devLink);
      },
      options: {}
    } as any
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev_secret_change_me",
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) token.isPro = !!mockAuthDB.proUsers.get(user.email);
      return token;
    },
    async session({ session, token }) {
      (session.user as any).isPro = !!token.isPro;
      return session;
    }
  },
  pages: { signIn: "/auth/signin" }
});
