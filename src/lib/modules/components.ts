import { Core } from '@lib/core/core'
import { isFile } from '@lib/utils/files'
import { createLogger } from '@lib/utils/logging'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { run } from '@lib/utils/parent'
import { IFile } from '@lib/classes/directory'
import { COMPONENTS_DIR_PATH, DIST_DIR } from '@lib/constants/directories'
import { BuildMessage } from '@lib/types/messages'
import { Args } from '@lib/constants/args'

import path from 'path'
import JSON5 from 'json5'
import chokidar from 'chokidar'

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
      const dirPath = path.join(COMPONENTS_DIR_PATH, dir)
      const configPath = path.join(dirPath, "config.json5")

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
        logger.info(`Replaced component "${config.name}" with the new information in the components list.`)
      } else {
        this.components.push(component);
        logger.info(`Added new component "${config.name}" to the components list.`)
      }

      // Add watcher for every component if watch flag is set
      if (Args.isWatch) {
        logger.info(`Watcher added for component "${component.name}".`)

        chokidar.watch(dirPath, {
          persistent: true,
          ignoreInitial: true
        })
          .on("all", (_event, _path) => {
            logger.info(`Component file "${_path}" changed, rebuilding the component "${component.name}"`)
            this.buildComponent(component)
            this.core.emit("component:changed", { component })
          })
      }
    }

    logger.info(`Found ${this.components.length} components in the components folder.`)
  }


  // TODO: Doesn't work currently
  public async buildDependencyGraph() {

  }

  public async buildAll() {
    logger.info("Starting building all known components...")

    for (let i = 0; i < this.components.length; i++) {
      const component: IComponent = this.components[i];
      await this.buildComponent(component)
    }
  }

  public async buildComponent(component: IComponent) {

    logger.info(`Building component ${component.name}...`)

    const buildFilePath = component.absolutePaths.buildFile
    const buildMessage: BuildMessage = {
      type: "build",
      data: component
    }

    logger.debug("CHILD START")

    await run(buildFilePath, buildMessage)

    const componentFile: IFile = {
      name: component.name,
      type: "file",
      content: component
    }

    logger.debug("CHILD FINISHED")

    this.core.add(componentFile, "components")

  }
}

