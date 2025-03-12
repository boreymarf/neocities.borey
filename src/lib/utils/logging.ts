import { createConsola, ConsolaInstance } from "consola";

export const logger = createConsola({
  level: 4,
  //fancy: false
  // formatOptions: {
  //     columns: 80,
  //     colors: false,
  //     compact: false,
  //     date: false,
  // },
});

export function createLogger(tag: string): ConsolaInstance {
  return logger.withTag(tag);
}
