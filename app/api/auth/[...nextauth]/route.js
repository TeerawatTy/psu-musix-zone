// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../node_modules/.prisma/client'; // Adjust the import based on your structure
import { compare } from 'bcryptjs'; // Use bcrypt for password comparison

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                // Compare the hashed password
                if (user && await compare(credentials.password, user.password)) {
                    return user; // Return user object if authentication is successful
                }

                return null; // Return null if authentication fails
            },
        }),
    ],
    pages: {
        signIn: '/login', // Custom sign-in page
    },
};

// Exporting the NextAuth handler for POST requests
export const POST = (req, res) => NextAuth(req, res, authOptions);
