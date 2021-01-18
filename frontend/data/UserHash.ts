function userHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Takes nicknames and deterministically returns one of 16 CSS classes for them
 * @param nick the nickname that is to be transformed into one of 16 CSS classes
 * @returns a string in the format of nick-[0-15]
 */
export function getNickCSSClass(nick: string): string {
  return `nick-${userHash(nick) % 16}`;
}
