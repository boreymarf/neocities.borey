import { EventEmitter } from 'events';
import { logger } from '@lib/utils/logging';
import { AppEvents } from './events';

export class Core {
  private data: Record<string, any> = {}
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public async init(): Promise<void> {
    logger.start("The Core initialization has started.")

    // Literally nothing.

    logger.info("Core has been initialized.")
    this.emit("core:ready")
  }

  // Data



  // Events
  public emit<T extends keyof AppEvents>(
    event: T,
    ...args: AppEvents[T] extends undefined ? [] : [AppEvents[T]]
  ): void {
    this.eventEmitter.emit(event, ...args);
    logger.debug(`Event "${String(event)}" emitted`, args);
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


