import { spawn } from "node:child_process"
import { redisClient } from "./config/redis"
import { once } from 'node:events';
import 'dotenv/config'

await redisClient.connect()

while (1) {
  const { element }: any = await redisClient.brPop("submissions", 0)
  const { code: codes, language, userId, submissionId } = JSON.parse(element)

  let operation;
  if (language === "python") {
    operation = spawn(process.platform === "win32" ? "py" : "python3", ["-"]);
  } else {
    operation = spawn("node", ["--max-old-space-size=64", "-"]);
  }

  console.log(element)
  operation.stdin.write(codes)
  operation.stdin.end()
  let output = ""
  let error = ""
  operation.stdout.on('data', (data) => {
    output += data.toString()
  });

  operation.stderr.on('data', (data) => {
    error += data.toString()
  });

  const [code] = await once(operation, 'close');

  const response = {
    submissionId,
    codes,
    language,
    userId,
    output,
    error,
    exit: code
  }
  const stringifiedRes = JSON.stringify(response)
  let retries = 3
  while (retries--) {
    try {
      const subscribers = await redisClient.publish("worker-response", stringifiedRes)
      if (subscribers === 0) {
        console.log("No API server was listening...");
      }
      break
    } catch {
      console.log("Retries left ", retries)
    }
  }


}
