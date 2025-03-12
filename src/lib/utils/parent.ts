import { fork } from "child_process";
import path from 'path'
import { createLogger } from "./logging";

const TEMP_DIR = path.resolve("./.temp")

export type ComponentMessage =
  | {
    type: 'build';
    config: {
      outputDir: string;
    };
  }
  | {
    type: 'result';
    status: 'success' | 'failure';
    data: string;
    outputPath: string;
  };


export function run(sourcePath: string, outputDir: string, name?: string) {

  const fullSourcePath = path.resolve(process.cwd(), sourcePath)
  const logger = createLogger(name || "CHILD")

  const child = fork(fullSourcePath, {
    execArgv: [
      '-r', '@swc-node/register',
      '-r', 'tsconfig-paths/register'
    ],
    stdio: 'pipe',
    cwd: process.cwd()
  })

  // TODO: Make it pass on the consola log data instead of console output
  child.stdout?.on('data', (data) => logger.log(`${data}`.trim()));
  child.stderr?.on('data', (data) => logger.error(`${data}`.trim()));

  // Handle exit
  child.on('exit', (code) => {
    if (code !== 0) {
      logger.error(`Child exited with code ${code}`)
    }
  });

  //child.send({
  //  task: 'build',
  //  config: { outputDir: outputDir || TEMP_DIR }
  //});

  child.send({
    type: "build",
    config: {
      outputDir: outputDir
    }
  } satisfies ComponentMessage)
}
