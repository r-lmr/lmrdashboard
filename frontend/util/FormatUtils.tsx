import { StringUtils } from "./StringUtils";

export const FormatUtils = {
  /**
   * Formats everything between (and including) two asterisks bold
   * Assumes only one pair of asterisks in the text
   */
  formatBold: (text: string): JSX.Element => {
    const previousText = text.substring(0, text.indexOf('*'));
    const toMakeBold = text.substring(text.indexOf('*'), text.lastIndexOf('*') + 1);
    const restOfTheText = text.substring(text.lastIndexOf('*') + 1);
    return <> {previousText}<b>{toMakeBold}</b>{restOfTheText}</>;
  },

  /**
   * Formats link depending on whether the href or clickable text contains trailing characters.
   * Also splits up the href and clickable into parts with and without the trailing characters.
   */
  formatLink: (href: string, clickable: string): JSX.Element => {
    if (StringUtils.hasTrailingChar(clickable) || StringUtils.hasTrailingChar(href)) {
      const [clickableWithoutEndChar, endChar] = StringUtils.splitToTextWithoutTrailingAndTrailing(clickable);
      const hrefWithoutEndChar = StringUtils.splitToTextWithoutTrailingAndTrailing(href)[0];
      return <> <a href={hrefWithoutEndChar}>{clickableWithoutEndChar}</a>{endChar}</>;
    }
    return <> <a href={href}>{clickable}</a></>;
  }
}
