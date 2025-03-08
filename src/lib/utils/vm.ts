import { existsSync } from 'fs';
import { logger } from './logging';
import { isFile } from './files';

import ts from 'typescript';
import fs from 'fs'
import vm from 'vm'
import module from 'module'
import path from 'path'

const TRANSPILE_OPTIONS: Parameters<typeof ts.transpileModule>[1] = {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,

    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,

    paths: {
      "@lib/*": ["src/lib/*"],
      "@/*": ["."],
      "@components/*": ["src/components"]
    },                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
  }
};

export function cacheModule(source: string, destination: string) {

}

export function transpileAndRun(source: string, context: Record<string, any>): Record<string, any> {

  if (!existsSync(source)) {
    logger.error(`Module at path "${source}" does not exist!`)
    throw new Error(`Module at path "${source}" does not exists!`)
  }

  if (!isFile(source)) {
    logger.error(`"${source}" is not a file!`)
    throw new Error(`"${source}" is not a file!`)
  }

  // Transpiling
  const fileContent = fs.readFileSync(source, "utf8")
  const transpiledContent = ts.transpileModule(fileContent, TRANSPILE_OPTIONS).outputText

  logger.info(transpiledContent)
  logger.info("\n")

  // I fucking hate it with every piece of my soul
  // Running
  const newContext = vm.createContext({
    exports: {},
    module: { exports: {} },

    ...context
  })


  vm.runInContext(transpiledContent, newContext)

  // Return modified copy of the context
  return newContext

}
