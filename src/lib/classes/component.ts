import { ensureDirExists } from "@lib/utils/files.js";
import { logger } from "@lib/utils/logging.js";
import { ResultMessage } from "@lib/types/messages.js";
import { IComponent } from "@lib/modules/components.js";

import path from 'path';
import fs, { existsSync } from 'fs';
import { DIST_DIR } from "@lib/constants/directories.js";

export abstract class Component {

  protected configuration!: IComponent

  constructor() {

    process.on('message', async (message: any) => {

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

    // CSS
    ensureDirExists(DIST_DIR)
    const scssDist = path.resolve(DIST_DIR, "_dist.scss")

    if (!existsSync(scssDist)) {
      fs.writeFileSync(scssDist, "", 'utf8')
    }

    if (typeof this.configuration.absolutePaths.scssFile === 'string') {
      logger.error("THIS WORKS??")
      const scssDistContent = fs.readFileSync(scssDist, 'utf8')
      const modifiedContent = scssDistContent + '\n/* Your appended content here */';
      fs.writeFileSync(scssDist, modifiedContent, 'utf8');
    }

    // Result message
    if (process.send) {
      process.send({
        type: "result",
        status: "success",
      } satisfies ResultMessage)
    }

    process.exit(0)
  }
}
