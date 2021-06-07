import React from 'react';
import { getNickCSSClass } from '../data/UserHash';
import { FormatUtils } from '../util/FormatUtils';
import innerText from 'react-innertext';

export default function Message(props: IMessage): JSX.Element {
  /**
   * Matches strings containing a URL or subreddit
   */
  const subredditOrLinkRegex = /^.*((.+:\/\/)|(\/?r\/)).*$/;

  /**
   * Matches strings containing a URL
   */
  const linkRegex = /^.*(.+:\/\/).*$/;

  /**
   * Matches strings containing a *word* wrapped with asterisks
   */
  const asterisksRegex = /^.*(\*.*\*).*$/;

  const boldEscapeChar = '\u0002';

  /**
   * If a message contains URLs or (/)r/<subreddit> those parts will be linked.
   * Link formatting has precedence over aesthetic formatting
   */
  function enrichMessageContentFormattingPerPart(message: string): JSX.Element[] {
    return message.split(' ').map((messagePart: string) => {
      if (messagePart.startsWith('r/')) {
        return FormatUtils.formatLink('https://reddit.com/' + messagePart, messagePart);
      } else if (messagePart.startsWith('/r/')) {
        return FormatUtils.formatLink('https://reddit.com' + messagePart, messagePart);
      } else if (linkRegex.test(messagePart)) {
        return FormatUtils.formatLink(messagePart, messagePart);
      } else if (asterisksRegex.test(messagePart)) {
        return FormatUtils.formatBoldViaAsterisks(messagePart);
      } else {
        return <> {messagePart}</>;
      }
    });
  }

  function enrichMessageContentFormattingViaEscapeCodes(message: JSX.Element[]): JSX.Element[] {
    let preparedMessage = message;
    // Prepare for case if no previous formatting has been done,
    // i.e. the whole message content is in the first element
    // => Split it into parts as if previous formatting has been done
    if (message.length === 1) {
      preparedMessage = innerText(message[0])
        .split(' ')
        .map((it) => <> {it}</>);
    }
    return FormatUtils.formatBoldViaEscapeCharacter(preparedMessage);
  }

  function enrichMessageContentFormattingIfNeeded(message: string): JSX.Element[] {
    let formattedMessage: JSX.Element[] = [<>{message}</>];
    if (subredditOrLinkRegex.test(message) || asterisksRegex.test(message)) {
      formattedMessage = enrichMessageContentFormattingPerPart(message);
    }
    if (message.includes(boldEscapeChar)) {
      formattedMessage = enrichMessageContentFormattingViaEscapeCodes(formattedMessage);
    }
    return formattedMessage;
  }

  /**
   * Returns a message formatted in the way irssi formats it for /me.
   */
  function getFormattedActionMessage(): JSX.Element {
    return (
      <>
        [{props.dateCreated}] * <span className={getNickCSSClass(props.nick)}>{props.nick}</span>
        {props.message.replace('ACTION', '')}
      </>
    );
  }

  /**
   * Returns a message formatted in a normal <nick>: <message> format.
   */
  function getFormattedNormalMessage(): JSX.Element {
    return (
      <>
        [{props.dateCreated}] <span className={getNickCSSClass(props.nick)}>{props.nick}</span>:{' '}
        {enrichMessageContentFormattingIfNeeded(props.message)}
      </>
    );
  }

  return (
    <div>{props.message.slice(1).startsWith('ACTION') ? getFormattedActionMessage() : getFormattedNormalMessage()}</div>
  );
}

export interface IMessage {
  nick: string;
  message: string;
  dateCreated: string;
}
