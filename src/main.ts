import { Core } from "@lib/core/core";
import { Build } from "@lib/modules/build";
import { Components } from "@lib/modules/components";
import { debugComponents } from "@lib/modules/debugComponents";
import { logger } from "@lib/utils/logging";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const isDebug = args.debug === true;

const core = new Core()
new Components(core)
new Build(core)

if (isDebug) {
  logger.info("Debug is on.")
  new debugComponents(core)
}

core.init()
