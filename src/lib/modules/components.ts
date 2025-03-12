import { Core } from '@lib/core/core'
import { isFile } from '@lib/utils/files'
import { createLogger } from '@lib/utils/logging'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'

const logger = createLogger("COMPONENTS")
const COMPONENTS_DIR_PATH = path.resolve("./src/components")

export interface IComponent {
  name: string,
  buildFilePath: string,
  infoFilePath: string
  dependencies: {
    components: string[],
    libraries: string[]
  }
}

export class Components {

  private core: Core
  private components: IComponent[]

  constructor(core: Core) {
    this.core = core
    this.components = []

    core.once("core:ready", () => this.init().catch(logger.error))
  }

  public async init(): Promise<void> {
    logger.start("Components module started initialization.")

    await this.scanComponentsFolder()

    logger.info("Components module has been initialized.")
    this.core.emit("components:ready")
  }

  public async scanComponentsFolder(): Promise<void> {

    const dirs = readdirSync(COMPONENTS_DIR_PATH, { recursive: false, encoding: "utf8" })

    for (let i = 0; i < dirs.length; i++) {

      const dir = dirs[i];
      const dirPath = path.resolve(COMPONENTS_DIR_PATH, dir)
      const infoPath = path.resolve(dirPath, "info.json")

      if (isFile(dir)) {
        continue
      }

      if (!existsSync(infoPath)) {
        logger.error(`Component at path "${dirPath}" does not contain info.json`)
      }

      const info = JSON.parse(readFileSync(infoPath, 'utf8'))
      const component = info as IComponent

      // TODO: Component may be already exist in the array
      // Add check for that
      this.components.push(component)

      logger.info(this.components)
    }
  }

  // TODO: Doesn't work currently
  public async buildDependencyGraph() {

  }

  public async buildAll() {
    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];

    }
  }

  public async buildComponent(component: IComponent) {

  }

}

