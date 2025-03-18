import { Core } from "@lib/core/core";
import { createLogger } from "@lib/utils/logging";
import { Args } from "@lib/constants/args";
import { ensureDirExists } from "@lib/utils/files";
import { DIST_DIR, PUBLIC_DIR } from "@lib/constants/directories";

import sass from 'sass';
import fs, { existsSync } from 'fs';
import path from "path";
import chokidar from 'chokidar'

const logger = createLogger("BUILD")

export class Build {

  private core: Core

  constructor(core: Core) {
    this.core = core


    core.once("components:ready", () => this.init().catch(console.error))
  }


  public async init(): Promise<void> {
    logger.start("Build module started initialization.")

    this.buildSASS()

    if (Args.isWatch) {
      this.createWatchers()
    }

    logger.info("Build module finished initialization.")

  }

  public buildSASS() {

    // Creates partial scss file used to import other components' scss files
    // Will crash if it doesn't exist for some reason
    if (!existsSync(path.join(DIST_DIR, "_dist.scss"))) {
      fs.writeFileSync(path.join(DIST_DIR, "_dist.scss"), "", "utf8")
    }

    // Transpilation
    const mainPath = path.resolve("src/style/main.scss")
    let result = sass.compile(mainPath, {
      style: 'expanded', // Or 'compressed' for production
      sourceMap: Args.isDebug,
      sourceMapIncludeSources: true, // Embeds sources in the map (optional)
    });

    if (!result) {
      logger.error("Failed to compile scss!")
    }

    let cssOutput = result.css;
    if (Args.isDebug && result.sourceMap) {
      // Append source map URL comment
      // HACK: I don't know if it should be hard coded
      cssOutput += `\n/*# sourceMappingURL=style.css.map */`;
    }

    ensureDirExists(PUBLIC_DIR)
    ensureDirExists(DIST_DIR)

    fs.writeFileSync('public/style.css', cssOutput);
    if (result.sourceMap) {
      fs.writeFileSync('public/style.css.map', JSON.stringify(result.sourceMap));
    }

  }

  public async createWatchers(): Promise<void> {
    logger.info("Watcher added for SCSS.")

    chokidar.watch("./src/", {
      persistent: true,
      ignoreInitial: true,
      ignored: [
       /^.*(?<!\.scss)$/,     // Except SCSS files
    ]
    })
      .on("all", (_event, _path) => {
        logger.info(`SCSS file "${_path}" changed, rebuilding...`)
        this.buildSASS()
      })
  }

}
