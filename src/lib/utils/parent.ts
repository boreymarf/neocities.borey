import { fork } from "child_process";
import path from 'path'
import { createLogger } from "./logging.js";
import { BaseMessage, BuildMessage } from "@lib/types/messages.js";

export async function run(sourcePath: string, message?: BaseMessage): Promise<any> {
  const fullSourcePath = path.resolve(process.cwd(), sourcePath);
  const logger = createLogger("CHILD");

  return new Promise((resolve, reject) => {
    let resolved = false;

    const child = fork(fullSourcePath, {
      execArgv: [
        '--import=tsx'
      ],
      stdio: 'pipe',
      cwd: process.cwd()
    });

    child.stdout?.on('data', (data) => logger.log(`${data}`.trim()));
    child.stderr?.on('data', (data) => logger.error(`${data}`.trim()));

    // Handle messages from child
    child.on('message', (message: any) => {
      if (message.type === "result") {
        if (!resolved) {
          resolved = true;
          resolve(message.data); // Resolve with result data
        }
      }
    });

    // Handle process errors
    child.on('error', (err) => {
      if (!resolved) {
        reject(err);
      }
    });

    // Handle process exit
    child.on('exit', (code) => {
      if (!resolved) {
        if (code === 0) {
          resolve(undefined); // Resolve with no data if clean exit
        } else {
          reject(new Error(`Child exited with code ${code}`));
        }
      }
    });

    // Send initial message if provided
    if (message) {
      child.send(message);
    }
  });
}
