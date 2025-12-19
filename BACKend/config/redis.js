import { createClient } from "redis";

const redis = createClient({
  username: "myshow",
  password: "u#!9GRCZuXJDS.!", // same password that worked in testRedis.js
  socket: {
    host: "redis-19441.c266.us-east-1-3.ec2.cloud.redislabs.com",
    port: 19441
    // no tls here, since 19441 is non‑TLS
  }
});

redis.on("error", (err) => console.error("❌ Redis Client Error:", err));
redis.on("connect", () => console.log("✅ Redis Connected"));

await redis.connect();

export default redis;