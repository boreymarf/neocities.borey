import { Core } from "@lib/core/core";
import { createLogger } from "@lib/utils/logging";
import { Args } from "@lib/constants/args";

import sass from 'sass';
import fs from 'fs';
import path from "path";

const logger = createLogger("BUILD")

export class Build {

  private core: Core

  constructor(core: Core) {
    this.core = core


    core.once("components:ready", () => this.init().catch(console.error))
  }


  public async init(): Promise<void> {
    logger.start("Build module started initialization.")

    this.buildScss()

    logger.info("Build module finished initialization.")

  }

  public buildScss() {
    const mainPath = path.resolve("src/style/main.scss")
    const result = sass.compile(mainPath, {
      style: 'expanded', // Or 'compressed' for production
      sourceMap: Args.isDebug,
    });

    if (!result) {
      logger.error("Failed to compile scss!")
    }



    fs.writeFileSync('public/style.css', result.css);
    if (result.sourceMap) {
      fs.writeFileSync('public/style.css.map', JSON.stringify(result.sourceMap));
    }

  }
}
