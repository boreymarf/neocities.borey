import { logger } from "@lib/utils/logging"
import { buildBaseUrl } from "@lib/components/baseurl/baseurl"
import { buildFooter } from "@lib/components/footer/footer"
import { COMPONENT_UPDATE, eventManager } from "./EventManager"
import { REGEX } from "@lib/constants"
import { buildVersion } from "@lib/components/version/version"

export interface Component {
  name: string
  content: string
  sourceFile: string | string[] | null
  build: () => Component;
}

export class ComponentManager {

  public components: Component[]

  constructor() {
    this.components = []
  }


  registerComponent(newComponent: Component) {

    if (newComponent.name === "") {
      logger.error(`Cannot register component with empty name! ${JSON.stringify(newComponent)}`)
      return
    }

    if (newComponent.content === "") {
      logger.error(`Cannot register empty component! ${JSON.stringify(newComponent)}`)
      return
    }

    const index = this.components.findIndex(component => component.name === newComponent.name);

    if (index !== -1) {
      this.components[index] = newComponent
      logger.info(`Component "${newComponent.name}" already exists, replaced.`)

    } else {
      this.components.push(newComponent)
      logger.info(`Component "${newComponent.name}" added.`)
    }

  }

  // this works, ok?
  buildAllComponents() {
    this.registerComponent(buildVersion())
    this.registerComponent(buildBaseUrl())
    this.registerComponent(buildFooter())
  }

  getComponent(name: string): Component | undefined {
    const index = this.components.findIndex(component => component.name === name);

    if (index === -1) {
      logger.error(`Component "${name}" does not exists!`)
      return undefined
    } else {
      return this.components[index]
    }

  }

  insertComponent(
    fileContent: string,
    operationType: "allRegistered" | "byName" | "manual",
    options?: {
      onlyOnce?: boolean,
      componentName?: string
      manualComponents?: Component[]
    }): string {

    const resolvedOptions = { onlyOnce: false, manualComponents: null, componentName: null, ...options };
    let replaced = false
    let components: Component[] = []

    switch (operationType) {
      case "manual":
        if (!resolvedOptions.manualComponents) {
          throw new Error("Used manual operation type, but no manualComponents was given!")
        }
        components = resolvedOptions.manualComponents
        break;

      case "allRegistered":
        const fileSlots = [...fileContent.matchAll(REGEX.COMPONENT)].map(match => match[1]);
        components = fileSlots
          .map(slot => this.getComponent(slot))
          .filter((component): component is Component => component !== undefined);
        break;

      case "byName":
        if (!resolvedOptions.componentName) {
          throw new Error(`Used byName operation type, but no componentName was given!`)
        }

        const component = this.getComponent(resolvedOptions.componentName)

        if (!component) {
          throw new Error(`Component "${resolvedOptions.componentName}" was not found`);
        }

        components.push(component)
        break;
    }

    logger.debug(components)

    fileContent = fileContent.replace(REGEX.COMPONENT, (match, g1) => {
      if (replaced && resolvedOptions.onlyOnce) {
        return match
      }
      const filteredArray = components.filter(item => item.name === g1);
      if (filteredArray.length > 0) {
        replaced = true
        return filteredArray[0].content
      }

      return match
    });

    return fileContent


    //fileContent = fileContent.replace(REGEX.COMPONENT, (match, p1) => {
    //  if (replaced && resolvedOptions.onlyOnce) {
    //    return match
    //  }
    //
    //  if (p1.toLowerCase() === componentName) {
    //    replaced = true
    //    return component || match;
    //  }
    //
    //  return match;
    //});

  }

  updateComponent(sourceFile: string) {
    const index = this.components.findIndex(component => {
      if (Array.isArray(component.sourceFile)) {
        return component.sourceFile.includes(sourceFile);
      } else {
        return component.sourceFile === sourceFile;
      }
    });

    if (index === -1) {
      logger.error(`Component with the source "${sourceFile}" does not exists!`)
    } else {
      this.components[index] = this.components[index].build()
      eventManager.emit(COMPONENT_UPDATE, this.components[index].name)
    }

  }

}

export const componentManager: ComponentManager = new ComponentManager()
