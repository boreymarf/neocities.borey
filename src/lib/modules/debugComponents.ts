import { Core } from "@lib/core/core"
import { createLogger } from "@lib/utils/logging"

const logger = createLogger("DEBUG_COMPONENTS")

export class debugComponents {

  private core: Core

  constructor(core: Core) {
    this.core = core

    core.once("components:ready", () => this.init().catch(console.error))
  }

  private async init(): Promise<void> {
    logger.start("DebugComponents module started initialization.")



    logger.info("DebugComponents module finished initialization.")


  }


}
