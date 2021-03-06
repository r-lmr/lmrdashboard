export const StringUtils = {

  hasTrailingChar: (text: string): boolean => {
    return [',', '.', '!', '?'].includes(text[text.length - 1])
  },

  splitToTextWithoutTrailingAndTrailing: (text: string): Array<string>=> {
    const textWithoutEndChar = text.slice(0, text.length - 1);
    const endChar = text[text.length - 1];
    return [textWithoutEndChar, endChar];
  }
}
