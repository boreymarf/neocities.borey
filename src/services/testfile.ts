import { CONTENT, SRC, STATIC } from "@lib/constants";
import { componentManager } from "@lib/managers/ComponentManager";
//import { storageManager } from "@lib/managers/StorageManager";
import { logger } from "@lib/utils/logging";
import path from 'path'
import fs from 'fs'
import { buildManager } from "@lib/managers/BuildManager";
function main() {
  logger.start("Start of the test session...")

  //buildManager.registerStatic()
  //logger.debug(JSON.stringify(buildManager.slots))
  //logger.debug(storageManager.slotMap)  

  componentManager.buildAllComponents()
  //logger.debug(componentManager.insertComponent("[component:footer][component:base_url]test", "byName", { componentName: "base_url" }))

  buildManager.buildFile(path.join(STATIC.DIR, "index.html"))

  //componentManager.buildAllComponents()
  //componentManager.updateComponent('f')

}

if (require.main === module) {
  main();
}
