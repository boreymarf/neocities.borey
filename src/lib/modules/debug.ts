import { Core } from "@lib/core/core"
import { createLogger } from "@lib/utils/logging"
import { IDirectory, IFile } from "@lib/classes/directory"
import path from "path"
import fs from 'fs'
import { replace } from "@lib/utils/text"
import { ensureDirExists } from "@lib/utils/files"
import { PUBLIC_DIR } from "@lib/constants/directories"
import { IComponent } from "./components"

const logger = createLogger("DEBUG")
const DEBUG_COMPONENT_HTML = path.resolve("./src/pages/debugComponent.html")
const DEBUG_COMPONENT_PUBLIC = path.join(PUBLIC_DIR, "debug")

export class debug {

  private core: Core

  constructor(core: Core) {
    this.core = core

    // BUG: Вызывает ошибку если *оба* модуля ещё не выполнили свой init()!
    // Нужно сделать класс, который позволяет легко сделать проверку на завершение n-нного количества модулей.
    core.once("components:ready", () => this.init().catch(console.error))
    //core.once("build:complete", () => this.init().catch(console.error))
  }

  private async init(): Promise<void> {
    logger.start("Debug module started initialization.")

    this.debugComponents()

    logger.info("DebugComponents module finished initialization.")

    this.core.on("component:changed", ({ component }) => {
      logger.info(`Creating new debug component page for ${component.name}`)
      this.createDebugComponentPage(component)
    })
  }

  private debugComponents(): void {


    const components: IDirectory = this.core.get("components") as IDirectory

    for (let i = 0; i < components.items.length; i++) {

      const item = components.items[i]

      if (item.type === "directory") {
        continue
      }

      const component: IComponent = item.content
      this.createDebugComponentPage(component)

      //const component: IFile = components.items[i] as IFile;
      //const componentContent = fs.readFileSync(component.content, 'utf8')
      //const debugTemplate = fs.readFileSync(DEBUG_COMPONENT_HTML, 'utf8')
      //
      //logger.info(component)
    }
  }

  private createDebugComponentPage(component: IComponent): void {


    const componentHTML = fs.readFileSync(component.absolutePaths.outputs.html as string, 'utf8')

    logger.debug(`Component "${component.name}" has html: "${componentHTML}"`)

    const debugTemplate = fs.readFileSync(DEBUG_COMPONENT_HTML, 'utf8')
    const debugPage = replace(debugTemplate, "component", componentHTML)
    const debugPagePath = path.join(DEBUG_COMPONENT_PUBLIC, `${component.name}.html`)

    ensureDirExists(DEBUG_COMPONENT_PUBLIC)
    fs.writeFileSync(debugPagePath, debugPage, 'utf8')
  }
}
