import { ensureDirExists } from "@lib/utils/files";
import { logger } from "@lib/utils/logging";
import { BaseMessage } from "@lib/utils/parent";

import path from 'path';
import fs from 'fs';
import JSON5 from 'json5'

export interface BuildMessage extends BaseMessage {
  type: "build",
  buildConfig: BuildConfig
}

interface ResultMessage extends BaseMessage {
  type: "result";
  status: "success" | "failure";
  data: string;
  outputPath: string;
  stats: {
    size: number
  }
}

interface BuildConfig {
  componentDir: string,
  outputDir: string
}

export abstract class Component {

  protected buildConfig!: BuildConfig
  protected componentDir!: string
  protected componentConfig!: any

  constructor() {

    process.on('message', async (message: any) => {
      this.buildConfig = message.buildConfig as BuildConfig
      this.componentDir = this.buildConfig.componentDir
      this.componentConfig = this.getConfig()

      logger.info(this.buildConfig)

      if (message.type === "build") {
        try {
          this.build()
        } catch (error) {
          logger.error('Build failed:', error);
          process.exit(1);
        }
      }
    })
  }

  /**
   * This method is triggered when a build initiation message is received from the parent. 
   * It is responsible for executing the build logic and, upon completion, 
   * must call the `output(result: string)` method to finalize the process.
   */
  protected abstract build(): void;


  protected readFile(relativePath: string): string {

    const dir = this.buildConfig.componentDir
    const filePath = path.join(dir, relativePath)

    return fs.readFileSync(filePath, 'utf8')

  }

  protected getConfig(): string {

    // Yeah I know I can make it one line
    const dir = this.buildConfig.componentDir
    const configPath = path.join(dir, "config.json5")
    const configContent = fs.readFileSync(configPath, 'utf8')
    return JSON5.parse(configContent)

  }

  /**
   * Sends the content of the `result` string to the `outputDir` directory (specified by the parent) 
   * with a filename defined in the `config.json5` configuration file. 
   * After writing the file, it terminates the child process.
   */
  protected output(result: string): void {

    // Checks
    if (!this.buildConfig.outputDir) {
      throw Error("No outputDir in the buildConfig!");
    }

    if (!this.buildConfig.componentDir) {
      throw Error("No componentDir in the buildConfig!")
    }

    const outputDir = this.buildConfig.outputDir
    ensureDirExists(outputDir)
    const outputFilePath = path.resolve(outputDir, this.componentConfig.outputFileName)
    fs.writeFileSync(outputFilePath, result, 'utf8')

    if (process.send) {
      process.send({
        type: "result",
        status: "success",
        data: result,
        outputPath: outputFilePath,
        stats: {
          size: 0
        }
      } satisfies ResultMessage)
    }

    process.exit(0)
  }

  protected replace(content: string, target: string, replacement: string) {
    const sanitazedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\{\\{\\s*${sanitazedTarget}\\s*\\}\\}`, 'g');
    return content.replace(regex, replacement);
  }
}
