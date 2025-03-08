// ----------------------------------------------------- //
// THIS FILE IS USED PURELY FOR TESTING SNIPPETS OF CODE //
// ----------------------------------------------------- //

//import { logger } from "@lib/utils/logging";
//import { transpileAndRun } from "@lib/utils/vm";
//import path from 'path'
//
//const context = transpileAndRun(path.resolve("./src/components/clock/build.ts"), {})
//const output = context.main()
//logger.info(output)

import vm from 'vm';
import { readFileSync } from 'fs';

// Create your custom context
const context = vm.createContext({
  // Inject modules/functions
  require: (module: string) => {  // Custom require
    if (module === 'my-module') {
      return {
        myFunction: () => 'Hello from injected module!'
      };
    }
    throw new Error(`Module ${module} not allowed`);
  },
  console,  // Expose console
  Buffer,  // Expose Buffer
  __dirname: process.cwd()  // Custom dirname
} as any);  // Type assertion for flexibility

// Run code in context
vm.runInContext(`
  const myMod = require('my-module');
  console.log(myMod.myFunction());
`, context);
