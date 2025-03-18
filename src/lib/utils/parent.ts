import { fork } from "child_process";
import path from 'path'
import { createLogger } from "./logging";
import { BaseMessage, BuildMessage } from "@lib/types/messages";

// TODO: Add timer of how long the process has been running
export function run(sourcePath: string, message?: BaseMessage) {

  const fullSourcePath = path.resolve(process.cwd(), sourcePath)
  const logger = createLogger("CHILD")

  // Configuration
  const child = fork(fullSourcePath, {
    execArgv: [
      '-r', '@swc-node/register',
      '-r', 'tsconfig-paths/register'
    ],
    stdio: 'pipe',
    cwd: process.cwd()
  })

  //child.stdout?.on('data', (data) => logger.log(`${data}`.trim()));
  //child.stderr?.on('data', (data) => logger.error(`${data}`.trim()));

  //Handle output
  child.on('message', (message: any) => {
    if (message.type === "result") {

    }
  });

  // Handle exit
  child.on('exit', (code) => {
    if (code !== 0) {
      logger.error(`Child exited with code ${code}`)
    }
  });

  // If message provided, send it
  if (message) {
    child.send(message)
  }
}
