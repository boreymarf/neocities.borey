import { EventEmitter } from 'events';
import { createLogger } from '@lib/utils/logging';
import { AppEvents } from './events';
import { Directory, IDirectory, IFile } from '@lib/classes/directory';

const logger = createLogger("CORE")

export class Core {
  private data: IDirectory
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.data = new Directory()
  }

  public async init(): Promise<void> {
    logger.start("The Core initialization has started.")

    // Literally nothing.

    logger.info("Core has been initialized.")
    this.emit("core:ready")
  }

  // Data
  // HACK: Very incomplete and sucks ass   
  public add(item: IFile, path: string) {
    const dirs: string[] = path.split("/")

    logger.debug(dirs)

    let currentDir: IDirectory = this.data

    for (let i = 0; i < dirs.length; i++) {
      const dir = this.data[dirs[i]]

      if (!dir) {
        currentDir.add(new Directory(dirs[i]))          // Create new directory
        currentDir = currentDir[dirs[i]] as IDirectory  // Get the new directory that was just created
      } else {
        currentDir = dir as IDirectory
      }

      currentDir.add(item)

      logger.info(`Added "${item.name}" to the path "${path}"`)
      //logger.info(JSON.stringify(this.data))
    }

  }

  public get(path: string): IFile | IDirectory | undefined {
    const dirs: string[] = path.split("/")
    let currentDir: IDirectory = this.data

    for (let i = 0; i < dirs.length - 1; i++) {
      const dir = this.data[dirs[i]];

      if (!dir) {
        throw new Error(`Could not find dir "${dirs[i]}" at path "${path}"`)
      }

      if (!(dir instanceof Directory)) {
        throw new Error(`Cannot proceed as "${dirs[i]}" in path "${path}" is not a directory!`)
      };

      currentDir = dir

      logger.debug(`dir ${JSON.stringify(dir)}`)
    }

    const target = currentDir.get(dirs[dirs.length - 1])

    if (!target) {
      throw new Error(`Could not find file at path "${path}"`)
    }

    logger.debug(target)

    return target
  }

  // Events
  public emit<T extends keyof AppEvents>(
    event: T,
    ...args: AppEvents[T] extends undefined ? [] : [AppEvents[T]]
  ): void {
    logger.debug(`Event "${String(event)}" emitted`, args);
    this.eventEmitter.emit(event, ...args);
  }

  public on<T extends keyof AppEvents>(
    event: T,
    listener: (payload: AppEvents[T]) => void
  ): void {
    this.eventEmitter.on(event, listener);
  }

  public once<T extends keyof AppEvents>(
    event: T,
    listener: (payload: AppEvents[T]) => void
  ): void {
    this.eventEmitter.once(event, listener);
  }

  public off<T extends keyof AppEvents>(
    event: T,
    listener: (payload: AppEvents[T]) => void): void {
    this.eventEmitter.off(event, listener);
  }

}


