import { getNickCSSClass } from '../data/UserHash';
import { FormatUtils } from '../util/FormatUtils';

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

  /** 
   * If a message contains URLs or (/)r/<subreddit> those parts will be linked.
   * Link formatting has precedence over aesthetic formatting
   */
  function enrichMessageContentFormatting(message: string): JSX.Element[] {
    return message.split(' ')
      .map(messagePart => {
        if (messagePart.startsWith('r/')) {
          return FormatUtils.formatLink('https://reddit.com/' + messagePart, messagePart);
        } else if (messagePart.startsWith('/r/')) {
          return FormatUtils.formatLink('https://reddit.com' + messagePart, messagePart);
        } else if (linkRegex.test(messagePart)) {
          return FormatUtils.formatLink(messagePart, messagePart);
        } else if (asterisksRegex.test(messagePart)) {
          return FormatUtils.formatBold(messagePart);
        } else {
          return <> {messagePart}</>
        }
      });
  }

  function enrichMessageContentFormattingIfNeeded(message: string): string | JSX.Element[] {
    if (subredditOrLinkRegex.test(message) || asterisksRegex.test(message)) {
      return enrichMessageContentFormatting(message);
    }
    return message;
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
      [{props.dateCreated}] <span className={getNickCSSClass(props.nick)}>{props.nick}</span>: {
        enrichMessageContentFormattingIfNeeded(props.message)
      }
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
