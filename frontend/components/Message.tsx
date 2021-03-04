import { getNickCSSClass } from '../data/UserHash';
import { hasTrailingChar, splitToTextWithoutTrailingAndTrailing } from '../util/stringUtils';

export default function Message(props: IMessage): JSX.Element {

  /**
   * Wraps an a href around text, given an url and clickable text.
   */
  function formatLinkNormally(href: string, clickable: string): JSX.Element {
    return <span> <a href={href}>{clickable}</a></span>;
  }

  /**
   * 
   * Wraps an a href around text, given an url and clickable text,
   * but excludes a trailing , or . from the clickable link.
   */
  function formatLinkWithEndChar(href: string, clickable: string, endChar: string): JSX.Element {
    return <span> <a href={href}>{clickable}</a>{endChar}</span>;
  }

  /**
   * Calls either link formatting method depending on whether the href or clickable text contains trailing characters.
   * Also splits up the href and clickable into parts with and without the trailing characters.
   */
  function formatLink(href: string, clickable: string): JSX.Element {
    if (hasTrailingChar(clickable) || hasTrailingChar(href)) {
      const [clickableWithoutEndChar, endChar] = splitToTextWithoutTrailingAndTrailing(clickable);
      const hrefWithoutEndChar = splitToTextWithoutTrailingAndTrailing(href)[0];
      return formatLinkWithEndChar(hrefWithoutEndChar, clickableWithoutEndChar, endChar);
    }
    return formatLinkNormally(href, clickable);
  }

  /** 
   * If a message contains URLs or (/)r/<subreddit> those parts will be linked.
   */
  function linkifyMessageContent(message: string): JSX.Element[] {
    return message.split(' ')
      .map(messagePart => {
        if (messagePart.startsWith('r/')) {
          return formatLink('https://reddit.com/' + messagePart, messagePart);
        } else if (messagePart.startsWith('/r/')) {
          return formatLink('https://reddit.com' + messagePart, messagePart);
        } else if (messagePart.startsWith('https://')) {
          return formatLink(messagePart, messagePart);
        } else {
          return <span> {messagePart}</span>
        }
      });
  }

  /**
   * Returns a message formatted in the way irssi formats it for /me.
   */
  function getFormattedActionMessage(): JSX.Element {
    return (<>
      [{props.dateCreated}] * <span className={getNickCSSClass(props.nick)}>{props.nick}</span>{props.message.replace('ACTION', '')}
    </>)
  }

  /**
   * Returns a message formatted in a normal <nick>: <message> format.
   */
  function getFormattedNormalMessage(): JSX.Element {
    return (<>
      [{props.dateCreated}] <span className={getNickCSSClass(props.nick)}>{props.nick}</span>: {linkifyMessageContent(props.message)}
    </>)
  }

  return (
    <div>
      {props.message.slice(1).startsWith('ACTION') ?
        getFormattedActionMessage() :
        getFormattedNormalMessage()}
    </div>
  );
}

export interface IMessage {
  nick: string;
  message: string;
  dateCreated: string;
}
