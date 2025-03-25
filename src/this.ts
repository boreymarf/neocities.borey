// ----------------------------------------------------- //
// THIS FILE IS USED PURELY FOR TESTING SNIPPETS OF CODE //
// ----------------------------------------------------- //

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import ora from "ora";

for (let i = 0; i < 10; i++) {
  await testWithSpinner();
}

async function testWithSpinner() {
  const spinner = ora({
    text: "Building component...",
    spinner: "dots", // Try "arc", "dots", "line", etc.
  }).start();

  // Simulate work (3 seconds)
  await wait(1000);

  spinner.succeed("Building component... done!");
}

await wait(10000000)
