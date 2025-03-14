import { Core } from '@lib/core/core'
import { isFile } from '@lib/utils/files'
import { createLogger } from '@lib/utils/logging'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import JSON5 from 'json5'
import { run } from '@lib/utils/parent'
import { IFile } from '@lib/classes/directory'

const logger = createLogger("COMPONENTS")
const COMPONENTS_DIR_PATH = path.resolve("./src/components")
const OUTPUT_DIR = path.resolve("dist/")

export interface IComponent {
  name: string,
  dir: string,
  config: {
    outputFileName: string,
    buildFilePath: string,
    dependencies: {
      components: string[],
      libraries: string[]
    }
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
    await this.buildAll()

    logger.info("Components module has been initialized.")
    this.core.emit("components:ready")
  }


  public async scanComponentsFolder(): Promise<void> {

    logger.info("Scanning components folder for directories...")

    const dirs = readdirSync(COMPONENTS_DIR_PATH, { recursive: false, encoding: "utf8" })

    for (let i = 0; i < dirs.length; i++) {

      const dir = dirs[i];
      const dirPath = path.resolve(COMPONENTS_DIR_PATH, dir)
      const infoPath = path.resolve(dirPath, "config.json5")

      // Checks
      if (isFile(dir)) {
        continue
      }
      if (!existsSync(infoPath)) {
        logger.error(`Component at path "${dirPath}" does not contain config.json5`)
      }

      // Parsing
      const config = JSON5.parse(readFileSync(infoPath, 'utf8'))
      const component: IComponent = {
        name: config.name,
        dir: path.join(COMPONENTS_DIR_PATH, dir),
        config: config
      }

      logger.info(`Added new component "${config.name}".`)

      // TODO: Component may be already exist in the array
      // Add check for that
      this.components.push(component)
    }

    logger.info(`Found ${this.components.length} components in the components folder.`)
  }


  // TODO: Doesn't work currently
  public async buildDependencyGraph() {

  }


  public async buildAll() {
    for (let i = 0; i < this.components.length; i++) {
      const component: IComponent = this.components[i];
      const componentBuildPath = path.join(component.dir, component.config.buildFilePath)

      run(componentBuildPath, path.resolve("./dist"))

      const componentFilePath = path.join(OUTPUT_DIR, component.config.outputFileName)
      const componentFile: IFile = {
        name: component.name,
        type: "file",
        content: componentFilePath
      }

      this.core.add(componentFile, "components")
    }
  }

  public async buildComponent(component: IComponent) {

  }

}

