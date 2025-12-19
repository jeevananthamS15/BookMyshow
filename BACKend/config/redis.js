import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // no TLS here, since 19441 is non‑TLS
  },
});

redis.on("error", (err) => console.error("❌ Redis Client Error:", err));
redis.on("connect", () => console.log("✅ Redis Connected"));

await redis.connect();

export default redis;