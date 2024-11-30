// lib/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { hashPassword } from "@/utils/hashPassword"; // Your password hashing utility

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await hashPassword(credentials.password)) === user.password) {
          return { id: user.id, email: user.email, name: user.name };
        }
        return null;  // If credentials don't match, return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // Set in .env
  session: {
    strategy: "jwt",  // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.name = token.name;
      return session;
    },
  },
};

export default authOptions;
