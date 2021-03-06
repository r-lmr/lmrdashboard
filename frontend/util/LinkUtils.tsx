import { StringUtils } from "./StringUtils";

export const LinkUtils = {
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
