// ----------------------------------------------------- //
// THIS FILE IS USED PURELY FOR TESTING SNIPPETS OF CODE //
// ----------------------------------------------------- //

import ora from "ora";
import consola from "consola";

const spinner = ora("Building component...").start();

// Works alongside Consola
consola.info("Consola log while spinner is active");

// Later...
spinner.succeed("Component built!");
