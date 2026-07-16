import { spawn } from "node:child_process"
import { redisClient } from "./config/redis"
import { once } from 'node:events';
import 'dotenv/config'

await redisClient.connect()

function isMalicious(code: string, language: string): boolean {
  if (language === "python") {
    const pattern = /\b(import\s+(os|sys|subprocess|shutil|importlib|builtins|socket)|from\s+(os|sys|subprocess|shutil|importlib|builtins|socket)\s+import|eval\s*\(|exec\s*\(|open\s*\(|__import__)/i;
    return pattern.test(code);
  } else {
    const pattern = /\b(require\s*\(|import\s+.*from|child_process|fs|process|eval\s*\(|Function\s*\()/i;
    return pattern.test(code);
  }
}

while (1) {
  const { element }: any = await redisClient.brPop("submissions", 0)
  const { code: codes, language, userId, submissionId } = JSON.parse(element)

  console.log(element)

  let output = ""
  let error = ""
  let exitCode: number | null = 0

  if (isMalicious(codes, language)) {
    error = "Security Error: Blocked execution of disallowed modules/functions"
    exitCode = 1
  } else {
    let operation;
    if (language === "python") {
      operation = spawn(process.platform === "win32" ? "py" : "python3", ["-"]);
    } else {
      const nodePath = process.platform === "win32" ? "node" : "/usr/bin/node";
      operation = spawn(nodePath, ["--max-old-space-size=64", "-"]);
    }

    operation.stdin.write(codes)
    operation.stdin.end()

    operation.stdout.on('data', (data) => {
      output += data.toString()
    });

    operation.stderr.on('data', (data) => {
      error += data.toString()
    });

    let killedDueToTimeout = false;
    const timeoutId = setTimeout(() => {
      killedDueToTimeout = true;
      operation.kill("SIGKILL");
    }, 5000);

    const [closeCode] = await once(operation, 'close');
    clearTimeout(timeoutId);

    if (killedDueToTimeout) {
      error = "Time Limit Exceeded (5000ms)";
      exitCode = 124;
    } else {
      exitCode = closeCode;
    }
  }

  const response = {
    submissionId,
    codes,
    language,
    userId,
    output,
    error,
    exit: exitCode
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
