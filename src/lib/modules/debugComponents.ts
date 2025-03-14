import { Core } from "@lib/core/core"
import { createLogger } from "@lib/utils/logging"
import { IComponent } from "./components"
import { IDirectory, IFile } from "@lib/classes/directory"
import path from "path"
import fs from 'fs'
import { replace } from "@lib/utils/text"
import { ensureDirExists } from "@lib/utils/files"
import { PUBLIC_DIR } from "@lib/constants/directories"

const logger = createLogger("DEBUG_COMPONENTS")
const DEBUG_COMPONENT_HTML = path.resolve("./src/pages/debugComponent.html")
const DEBUG_COMPONENT_PUBLIC = path.join(PUBLIC_DIR, "debug")

export class debugComponents {

  private core: Core

  constructor(core: Core) {
    this.core = core

    core.once("components:ready", () => this.init().catch(console.error))
  }

  private async init(): Promise<void> {
    logger.start("DebugComponents module started initialization.")

    const components: IDirectory = this.core.get("components") as IDirectory

    logger.info(components)

    for (let i = 0; i < components.items.length; i++) {
      const component: IFile = components.items[i] as IFile;
      const componentContent = fs.readFileSync(component.content, 'utf8')
      const debugTemplate = fs.readFileSync(DEBUG_COMPONENT_HTML, 'utf8')
      const debugPage = replace(debugTemplate, "component", componentContent)
      const debugPagePath = path.join(DEBUG_COMPONENT_PUBLIC, `${component.name}.html`)

      ensureDirExists(DEBUG_COMPONENT_PUBLIC)
      fs.writeFileSync(debugPagePath, debugPage, 'utf8')

      logger.info(component)
    }

    logger.info("DebugComponents module finished initialization.")


  }


}
