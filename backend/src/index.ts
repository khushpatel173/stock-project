// src/index.ts
import { connectDb } from "./config/db.js";
import { startServer } from "./server.js";


async function main() {
  await connectDb();
  console.log("DB connection successful");
  startServer();
}

main().catch((err) => {
  console.error("Failed to start:", err);
});