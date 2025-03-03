import path from 'path';
import fs from 'fs';

export function isFile(pathItem: string): boolean {
  return !!path.extname(pathItem);
}

export function ensureDirExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function ensureDirRemoved(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}
