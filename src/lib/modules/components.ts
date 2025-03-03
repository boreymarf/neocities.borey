import { Core } from '@lib/core/core'
import { logger } from '@lib/utils/logging'
import path from 'path'

const COMPONENTS_DIR = path.resolve("./src/components")

export class Components {

  private core: Core

  constructor(core: Core) {
    this.core = core
  }

  public async init(): Promise<void> {
    logger.start("Components module started initialization.")

    // ...

    logger.info("Components module has been initialized.")
    this.core.emit("components:ready")
  }
}
