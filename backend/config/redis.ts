import { createClient } from "redis"

const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Dedicated client for pub/sub — a subscribed Redis client
// can't run other commands (lPush, get, etc.)
const subscriberClient = redisClient.duplicate();

redisClient.on("error", function(err) {
  throw err;
});

subscriberClient.on("error", function(err) {
  throw err;
});

export { redisClient, subscriberClient }