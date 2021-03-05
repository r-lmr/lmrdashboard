export function hasTrailingChar(text: string): boolean {
  return [',', '.', '!', '?'].includes(text.slice(text.length - 1, text.length))
}

export function splitToTextWithoutTrailingAndTrailing(text: string): Array<string> {
  const textWithoutEndChar = text.slice(0, text.length - 1);
  const endChar = text.slice(text.length - 1);
  return [textWithoutEndChar, endChar];
}
