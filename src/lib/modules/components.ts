import { Core } from '@lib/core/core'
import { isFile } from '@lib/utils/files'
import { createLogger } from '@lib/utils/logging'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import JSON5 from 'json5'
import { run } from '@lib/utils/parent'
import { IFile } from '@lib/classes/directory'
import { COMPONENTS_DIR_PATH, DIST_DIR, OUTPUT_DIR } from '@lib/constants/directories'
import { BuildMessage } from '@lib/types/messages'

const logger = createLogger("COMPONENTS")

export interface IComponent {
  name: string

  // Contains absolute paths, generated during component building
  // Used by other modules to get component content
  absolutePaths: {
    componentDir: string;
    buildFile: string;
    outputs: {
      html: string | Record<string, string>;
      css?: string;
      js?: string;
      assets?: string;
    };
  };

  // Copies config.json5 file every component has
  config: {
    buildFilePath: string;
    output: {
      html: string | Record<string, string>;
      css?: string;
      js?: string;
      assets?: string;
    };
    dependencies: {
      components: string[];
      libraries: string[];
    };
  };
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

    // Read all dirs in the components directory
    const dirs = readdirSync(COMPONENTS_DIR_PATH, { recursive: false, encoding: "utf8" })
    for (let i = 0; i < dirs.length; i++) {

      const dir = dirs[i];
      const dirPath = path.resolve(COMPONENTS_DIR_PATH, dir)
      const configPath = path.resolve(dirPath, "config.json5")

      // Checks
      if (isFile(dir)) {
        continue
      }
      if (!existsSync(configPath)) {
        logger.error(`Component at path "${dirPath}" does not contain config.json5!`)
        continue
      }

      // Creating absolute paths
      const config = JSON5.parse(readFileSync(configPath, 'utf8'))
      const component: IComponent = {
        name: config.name,
        absolutePaths: {
          componentDir: dirPath,
          buildFile: path.join(dirPath, config.buildFilePath),
          outputs: {
            html: path.join(DIST_DIR, config.output.html)
          },
        },
        config: config
      }

      logger.debug(component)

      // Some more checks
      if (!existsSync(component.absolutePaths.buildFile)) {
        logger.error(`Component at path "${dirPath}" does not contains buildFile!`)
      }


      // Check if such component already exists
      const existingIndex = this.components.findIndex((c): c is IComponent =>
        c.name === component.name
      );

      if (existingIndex !== -1) {
        this.components.splice(existingIndex, 1, component);
        logger.info(`Replaced component "${config.name}" with the new information.`)
      } else {
        this.components.push(component);
        logger.info(`Added new component "${config.name}".`)
      }
    }

    logger.info(`Found ${this.components.length} components in the components folder.`)
  }


  // TODO: Doesn't work currently
  public async buildDependencyGraph() {

  }


  public async buildAll() {
    logger.info("Starting building all known modules...")

    for (let i = 0; i < this.components.length; i++) {
      const component: IComponent = this.components[i];
      const buildFilePath = component.absolutePaths.buildFile
      const buildMessage: BuildMessage = {
        type: "build",
        data: component
      }

      run(buildFilePath, buildMessage)
      const componentFile: IFile = {
        name: component.name,
        type: "file",
        content: component
      }

      this.core.add(componentFile, "components")
    }
  }

  public async buildComponent(component: IComponent) {

  }

}

