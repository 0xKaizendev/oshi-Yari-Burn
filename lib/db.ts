import { PrismaClient } from "@prisma/client";
declare global {
  var cachedPrisma: PrismaClient;
}
// defined in the global scope. This is because the global object is only
// defined in the global scope in Node.js and not in the browser.
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
let db: PrismaClient;
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  db = global.cachedPrisma;
}
export { db };