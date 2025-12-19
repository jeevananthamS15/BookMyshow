import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import redis from "./config/redis.js";

async function startServer() {
  try {
    await connectDB();
    // redis.connect() already called in config/redis.js
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Startup Error:", err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  await redis.quit();
  process.exit(0);
});