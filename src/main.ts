import { Args } from "@lib/constants/args";
import { Core } from "@lib/core/core";
import { Build } from "@lib/modules/build";
import { Components } from "@lib/modules/components";
import { debug } from "@lib/modules/debug";
import { logger } from "@lib/utils/logging";

const core = new Core()
new Components(core)
new Build(core)

if (Args.isDebug) {
  logger.info("Debug is on.")
  new debug(core)
}

core.init()
