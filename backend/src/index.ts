// src/index.ts
import { connectDb } from "./config/db.js";
import { startServer } from "./server.js";
import { fetchPendingBuyOrders } from "./services/map.js";


async function main() {
  await connectDb();
  console.log("DB connection successful");
  await fetchPendingBuyOrders();
  startServer();
}

main().catch((err) => {
  console.error("Failed to start:", err);
});