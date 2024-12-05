// import { PrismaClient } from '@prisma/client';

// // Initialize Prisma Client
// const prisma = new PrismaClient();

// // Export the Prisma instance so it can be used in your API routes
// export default prisma;

// lib/prisma.ts


import { PrismaClient } from '@prisma/client';


// Initialize Prisma Client
const prisma = new PrismaClient();

// Export the Prisma instance so it can be used in your API routes
export default prisma;  // Default export
