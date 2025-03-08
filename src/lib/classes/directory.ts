import { logger } from "@lib/utils/logging";

export interface IFile {
  name: string;
  content: string;
}

export interface IDirectory {
  name: string;
  items: (IFile | IDirectory)[];
  add(item: IFile | IDirectory): void;
  get(name: string): IFile | IDirectory | undefined;
  remove(item: IFile | IDirectory | string): void;
  [key: string]: IFile | IDirectory | string | (IFile | IDirectory)[] | Function | undefined;
}


// I think this implementation sucks ass
// but I'm too tired to change it
export class Directory implements IDirectory {
  public name: string;
  public items: (IFile | IDirectory)[]
  [key: string]: IFile | IDirectory | string | (IFile | IDirectory)[] | Function | undefined;

  constructor(name: string = 'root') {
    this.name = name;
    this.items = []

    return new Proxy(this, {
      get: (target, prop) => {

        if (prop in target) return (target as any)[prop];

        return target.items.find(i => i.name === prop) || undefined;
      },
    }) as Directory;
  }

  public add(item: (IFile | IDirectory)): void {

    const index = this.items.findIndex(f => f.name === item.name);

    if (index === -1) {
      this.items.push(item)
    } else {
      this.items[index] = item
    }

  }

  public remove(item: (IFile | IDirectory | string)): void {

    const itemName = (typeof item === "string") ? item : item.name;
    const index = this.items.findIndex(f => f.name === itemName)

    if (index === -1) {
      logger.log(`Tried to remove non-existent "${itemName}" in "${this.name}"`)
    } else {
      this.items = this.items.filter(f => f.name !== itemName)
    }

  }

  public get(name: string): IFile | IDirectory | undefined {

    const index = this.items.findIndex(f => f.name === name);

    if (index === -1) {
      logger.warn(`Directory class "${this.name}" tried to find "${name}" unsuccessfully.`)
    } else {
      return this.items[index]
    }
  }
}

// Is not used because I had no clue how to implement this
// This doesn't work with the work architecture

//export class Directory {
//  public name: string;
//  public content: (IFile | Directory)[]
//  [key: string]: string | (IFile | Directory)[] | Directory | IFile;
//
//  constructor() {
//    this.name = "root";
//    this.content = []
//
//    return new Proxy(this, {
//      get: (target, prop) => {
//
//        if (prop in target) return (target as any)[prop];
//
//        const file = target.content.find(d => d.name === prop);
//        return file || undefined;
//      },
//
//      set: (target, prop, value) => {
//
//        // If prop already exists in the target, for example property `name`
//        if (typeof prop === 'string' && prop in target) {
//          logger.debug(`Prop ${JSON.stringify(prop)} already exists in target ${JSON.stringify(target)}`)
//          target[prop] = value
//          return true
//        };
//
//        const propName = prop.toString()
//        const existingFileIndex = target.content.findIndex(f => f.name === propName);
//        value.name = propName
//
//        logger.debug(`Setter used on ${this.name} with params target:${JSON.stringify(target)}, propName:${propName}, value:${JSON.stringify(value)}`)
//
//        if (existingFileIndex >= 0) {
//          target.content[existingFileIndex].content = value;
//        } else {
//          target.content.push(value);
//        }
//
//        logger.debug(`New content on ${this.name} is ${JSON.stringify(this.content)}`)
//        return true
//      }
//
//
//    }) as Directory;
//  }
//}
