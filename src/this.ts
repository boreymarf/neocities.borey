// ----------------------------------------------------- //
// THIS FILE IS USED PURELY FOR TESTING SNIPPETS OF CODE //
// ----------------------------------------------------- //

import { run } from "@lib/utils/parent";
import { createLogger } from "@lib/utils/logging";
import path from "path";

const logger = createLogger("THIS")
logger.start("Start of the THIS session")

run(path.resolve("./src/components/header/build.ts"), "dist/")
