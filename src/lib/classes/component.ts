import { ensureDirExists } from "@lib/utils/files";
import { logger } from "@lib/utils/logging";
import { ResultMessage } from "@lib/types/messages";
import { IComponent } from "@lib/modules/components";

import path from 'path';
import fs from 'fs';
import JSON5 from 'json5'

export abstract class Component {

  protected configuration!: IComponent

  constructor() {

    process.on('message', async (message: any) => {
      logger.info(message)

      if (message.type === "build") {

        if (!message.data) {
          logger.error("No data provided for component build!")
          process.exit(1)
        }

        this.configuration = message.data

        try {
          this.build()
        } catch (error) {
          logger.error('Build failed:', error);
          process.exit(1);
        }
      }
    })
  };

  /**
   * This method is triggered when a build initiation message is received from the parent. 
   * It is responsible for executing the build logic and, upon completion, 
   * must call the `output(result: string)` method to finalize the process.
   */
  protected abstract build(): void;


  protected readFile(relativePath: string): string {

    const dir = this.configuration.absolutePaths.componentDir
    const filePath = path.join(dir, relativePath)

    return fs.readFileSync(filePath, 'utf8')

  }

  /**
   * Sends the content of the `result` string to the `outputDir` directory (specified by the parent) 
   * with a filename defined in the `config.json5` configuration file. 
   * After writing the file, it terminates the child process.
   */
  protected output(result: { html: string, css?: string, js?: string }): void {

    let htmlOutput

    // TODO: Doesn't work with arrays yet
    if (typeof this.configuration.absolutePaths.outputs.html === 'string') {
      ensureDirExists(path.dirname(this.configuration.absolutePaths.outputs.html));
      htmlOutput = path.resolve(this.configuration.absolutePaths.outputs.html)
    }

    fs.writeFileSync(htmlOutput!, result.html, 'utf8')

    //// Checks
    //const outputDir = this.buildConfig.outputDir
    //ensureDirExists(outputDir)
    //const outputFilePath = path.resolve(outputDir, this.componentConfig.outputFileName)
    //fs.writeFileSync(outputFilePath, result, 'utf8')

    if (process.send) {
      process.send({
        type: "result",
        status: "success",
      } satisfies ResultMessage)
    }

    process.exit(0)
  }
}
