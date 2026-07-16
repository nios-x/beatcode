import { createClient } from "redis"

const redisUrl = process.env.REDIS_URL?.replace(/^["']|["']$/g, "");
const redisClient = createClient({
  url: redisUrl
});

redisClient.on("error", function(err) {
  throw err;
});

export {redisClient}