import { ensureDirExists } from "@lib/utils/files";
import { createLogger } from "@lib/utils/logging";
import { ComponentMessage } from "@lib/utils/parent";
import fs from 'fs'
import path from "path";

const logger = createLogger("CLOCK")
let outputDir: string

// TODO: Потом сделать класс, который будет иметь общие функцие которые имеет компонент
// Например:
// - Отправка сообщений
// - Получение конфига
// - Записывание файла
// и т.д.
export function main() {

  // Actual logic
  const component = `
  <div>
  12:24 or something
  <div>
  `.trim()

  // Output
  ensureDirExists(outputDir)
  const outputFilePath = path.resolve(outputDir, "clock.html")
  fs.writeFileSync(outputFilePath, component, 'utf8')

  if (process.send) {
    process.send({
      type: "result",
      status: "success",
      data: component,
      outputPath: outputFilePath
    } satisfies ComponentMessage)
  }

  process.exit(0)
}

process.on('message', async (message: any) => {
  outputDir = message.config.outputDir

  if (message.task === "build") {
    try {
      main()
    } catch (error) {
      logger.error('Build failed:', error);
      process.exit(1);
    }
  }
})
