import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";  // Make sure bcrypt is installed
import { prisma } from "@/lib/prisma";  // Ensure you're correctly importing your prisma instance

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });

          // Check if user exists and compare hashed password with the provided password
          if (user && bcrypt.compareSync(credentials?.password || "", user.password)) {
            return { id: user.id, email: user.email, name: user.name };
          }
          return null;  // If credentials don't match, return null
        } catch (error) {
          console.error("Error during user authorization:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // Make sure the secret is defined in your .env
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
