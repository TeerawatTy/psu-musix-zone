// // app/api/auth/[...nextauth]/route.ts

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashPassword } from "@/utils/hashPassword";  // Your password hashing utility

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

export async function POST(req: Request) {
  return NextAuth(req, authOptions);  // Pass the authOptions to NextAuth
}

export async function GET(req: Request) {
  return NextAuth(req, authOptions);  // Pass the authOptions to NextAuth
}


// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) {
//           return null;
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           return null; // No user found
//         }

//         const isValidPassword = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isValidPassword) {
//           return null; // Invalid password
//         }

//         // Return user object
//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//         };
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   jwt: {
//     secret: process.env.NEXTAUTH_SECRET,
//   },
// };

// export async function POST(req: Request) {
//   const handler = NextAuth(authOptions);
//   return handler(req);
// }

// export async function GET(req: Request) {
//   const handler = NextAuth(authOptions);
//   return handler(req);
// }




// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "@/lib/prisma"; // Ensure correct import of prisma
// import { NextApiRequest, NextApiResponse } from "next";

// // Define your NextAuth options
// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials!;
//         // Validate the user here (using Prisma or your DB)
//         const user = await prisma.user.findUnique({
//           where: { email },
//         });

//         if (user && user.password === password) {
//           return { id: user.id, email: user.email };
//         }

//         return null;
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//     signOut: "/",
//     error: "/auth/error",
//     verifyRequest: "/auth/verify-request",
//     newAccount: "/account",
//   },
// };

// // Explicitly define the API route methods
// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   return NextAuth(req, res, authOptions);
// }

// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   return NextAuth(req, res, authOptions);
// }

