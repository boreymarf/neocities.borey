import { Core } from "@lib/core/core";
import { logger } from "@lib/utils/logging";

export class Build {

  private core: Core

  constructor(core: Core) {
    this.core = core


    core.once("components:ready", () => this.init().catch(console.error))
  }


  public async init(): Promise<void> {
    logger.start("Build module started initialization.")



    logger.info("Build module finished initialization.")

  }

}
