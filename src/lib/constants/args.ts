import minimist from "minimist";

const args = minimist(process.argv.slice(2));
export class Args {
  static isDebug = args.debug === true;
}

