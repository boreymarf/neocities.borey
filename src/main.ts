import { Args } from "@lib/constants/args.js";
import { DIST_DIR, PUBLIC_DIR } from "@lib/constants/directories.js";
import { Core } from "@lib/core/core.js";
import { Build } from "@lib/modules/build.js";
import { Components } from "@lib/modules/components.js";
import { debug } from "@lib/modules/debug.js";
import { logger } from "@lib/utils/logging.js";

import fs from 'fs'

if (Args.clean) {
  logger.info("Starting a clean build...")
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.rmSync(PUBLIC_DIR, { recursive: true })
  }
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true })
  }
}

const core = new Core()
new Components(core)
new Build(core)

if (Args.isDebug) {
  logger.info("Debug is on.")
  new debug(core)
}

core.init()
