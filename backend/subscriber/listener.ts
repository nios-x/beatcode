import { subscriberClient } from "../config/redis.js";
import { clients } from "../index.js";
import { prisma } from "../lib/prisma.js";

export const listenOutput = async () => {
    await subscriberClient.subscribe("worker-response", async (message: string) => {
        try {
            const data = JSON.parse(message);
            const userId = data.userId;
            const client = userId ? clients.get(userId) : null;

            await prisma.submission.updateMany({
                where: { submissionId: data.submissionId },
                data: {
                    output: data.output ?? null,
                    runtimeError: data.error ?? null,
                    isExecuted: true,
                    status: data.exit === 0 ? "success" : "error",
                },
            });

            if (client) {
                client.write(`event: submission\ndata: ${JSON.stringify(data)}\n\n`);
            }
        } catch (error) {
            console.error("Failed to process worker response", error);
        }
    });
};







