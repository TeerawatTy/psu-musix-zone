// utils/db.ts

// This is the Singleton pattern to create only one prisma instace
// no matter how many times restarting/refreshing a server, 
// it will return only one prisma instance

// import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () => {
//   return new PrismaClient()
//   // return new PrismaClient({ log: ['query'], })
// }

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

// utils/db.ts

import { PrismaClient } from '@prisma/client'

// Singleton pattern to ensure only one PrismaClient instance exists
const prismaClientSingleton = () => {
  return new PrismaClient()
  // You can enable logging if needed (e.g., for debugging queries)
  // return new PrismaClient({ log: ['query'], })
}

declare const globalThis: {
  prismaGlobal: PrismaClient
} & typeof global

// Ensure only one instance of PrismaClient is created during development (hot reload)
const prisma =
  globalThis.prismaGlobal ||
  prismaClientSingleton() // This ensures a new instance is created only if it doesn't already exist

// Assign the Prisma client to the global object to persist it across hot reloads in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma
