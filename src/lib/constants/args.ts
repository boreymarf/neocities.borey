import minimist from "minimist";

const args = minimist(process.argv.slice(2));
export class Args {
  static isDebug = args.debug === true;
  static isWatch = args.watch === true;
  static clean = args.clean === true;
}

