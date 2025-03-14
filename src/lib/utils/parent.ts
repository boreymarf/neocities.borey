import { fork } from "child_process";
import path from 'path'
import { createLogger } from "./logging";

const TEMP_DIR = path.resolve("./.temp")

export interface BaseMessage {
  readonly type: string;
}


// TODO: Add timer of how long the process has been running
export function run(sourcePath: string, outputDir: string) {

  const fullSourcePath = path.resolve(process.cwd(), sourcePath)
  const logger = createLogger("CHILD")

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

  // Handle output
  //child.on('message', (message: any) => {
  //  logger.log(message);
  //});

  // Handle exit
  child.on('exit', (code) => {
    if (code !== 0) {
      logger.error(`Child exited with code ${code}`)
    }
  });

  // Start building
  // TODO: Since this needs to be universal, rework this part
  // And add BaseMessage type as one of the arg of the run function
  child.send({
    type: "build",
    buildConfig: {
      outputDir: outputDir || TEMP_DIR,
      componentDir: path.dirname(sourcePath)
    }
  })
}
