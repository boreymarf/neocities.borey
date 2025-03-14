/**
 * Extracts the first `n` words from a given string.
 *
 * @param content - The input string from which to extract words.
 * @param amount - The number of words to extract.
 * @returns An array of the first `n` words from the string.
 */
export function getFirstWords(content: string, amount: number): string[] {
  const words = content.split(/\s+/);
  const firstWords = words.slice(0, amount);
  return firstWords;
}

export function replace(content: string, target: string, replacement: string) {
  const sanitazedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\{\\{\\s*${sanitazedTarget}\\s*\\}\\}`, 'g');
  return content.replace(regex, replacement);
}
