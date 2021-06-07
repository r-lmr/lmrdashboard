/* eslint-disable react/display-name */
import React from 'react';
import innerText from 'react-innertext';
import { StringUtils } from './StringUtils';

export const FormatUtils = {
  /**
   * Formats everything between (and including) two asterisks bold
   * Assumes only one pair of asterisks in the text
   */
  formatBoldViaAsterisks: (text: string): JSX.Element => {
    const previousText = text.substring(0, text.indexOf('*'));
    const toMakeBold = text.substring(text.indexOf('*'), text.lastIndexOf('*') + 1);
    const restOfTheText = text.substring(text.lastIndexOf('*') + 1);
    return (
      <>
        {' '}
        {previousText}
        <b>{toMakeBold}</b>
        {restOfTheText}
      </>
    );
  },

  /**
   * Formats everything after the bold escape character bold
   */
  formatBoldViaEscapeCharacter: (preparedMessage: JSX.Element[]): JSX.Element[] => {
    const escapeChar = '\u0002';

    const formattedMessage: JSX.Element[] = [];
    let escape = false;

    preparedMessage.forEach((messagePart: JSX.Element) => {
      const messagePartInnerText: string = innerText(messagePart);

      // Unset escaping if it has been set in a previous word
      // but the escape char appears in this word again
      if (escape && messagePartInnerText.includes(escapeChar)) {
        escape = false;
      }

      // Always apply the same formatting once an escape character has been used
      // (Un-escaping via the same character in a later word again)
      if (escape) {
        formattedMessage.push(<b>{messagePart}</b>);
      } else if (messagePartInnerText.includes(escapeChar)) {
        formattedMessage.push(<b>{messagePart}</b>);
        escape = true;
      } else {
        formattedMessage.push(<>{messagePart}</>);
      }

      // Unescaping if the same word contains the escape char again
      if (messagePartInnerText.slice(messagePartInnerText.indexOf(escapeChar) + 1).includes(escapeChar)) {
        escape = false;
      }
      if (messagePartInnerText.endsWith(escapeChar)) {
        escape = false;
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
      return (
        <>
          {' '}
          <a href={hrefWithoutEndChar}>{clickableWithoutEndChar}</a>
          {endChar}
        </>
      );
    }
    return (
      <>
        {' '}
        <a href={href}>{clickable}</a>
      </>
    );
  },
};
