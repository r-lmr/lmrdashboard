import innerText from "react-innertext";
import { StringUtils } from "./StringUtils";

export const FormatUtils = {
  /**
   * Formats everything between (and including) two asterisks bold
   * Assumes only one pair of asterisks in the text
   */
  formatBoldViaAsterisks: (text: string): JSX.Element => {
    const previousText = text.substring(0, text.indexOf('*'));
    const toMakeBold = text.substring(text.indexOf('*'), text.lastIndexOf('*') + 1);
    const restOfTheText = text.substring(text.lastIndexOf('*') + 1);
    return <> {previousText}<b>{toMakeBold}</b>{restOfTheText}</>;
  },

  /**
   * Formats everything after the bold escape character bold
   */
  formatBoldViaEscapeCharacter: (preparedMessage: JSX.Element[]): JSX.Element[] => {
    const formattedMessage: JSX.Element[] = [];
    let escapeCharUsed = false;

    preparedMessage.forEach((messagePart: JSX.Element) => {
      const messagePartInnerText: string = innerText(messagePart);

      // Always apply the same formatting once an escape character has been used
      // (No un-escaping or other escape chars supported)
      if (escapeCharUsed) {
        formattedMessage.push(<b>{messagePart}</b>);
      } else if (messagePartInnerText.includes('\u0002')) {
        formattedMessage.push(<b>{messagePart}</b>);
        escapeCharUsed = true;
      } else {
        formattedMessage.push(<>{messagePart}</>);
      }
    });

    return formattedMessage;

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
