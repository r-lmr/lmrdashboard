import { getNickCSSClass } from '../data/UserHash';
import { LinkUtils } from '../util/LinkUtils';

export default function Message(props: IMessage): JSX.Element {

  /** 
   * If a message contains URLs or (/)r/<subreddit> those parts will be linked.
   */
  function linkifyMessageContent(message: string): JSX.Element[] {
    return message.split(' ')
      .map(messagePart => {
        if (messagePart.startsWith('r/')) {
          return LinkUtils.formatLink('https://reddit.com/' + messagePart, messagePart);
        } else if (messagePart.startsWith('/r/')) {
          return LinkUtils.formatLink('https://reddit.com' + messagePart, messagePart);
        } else if (messagePart.startsWith('https://')) {
          return LinkUtils.formatLink(messagePart, messagePart);
        } else {
          return <> {messagePart}</>
        }
      });
  }

  function linkifyMessageContentIfMessageContainsUrlOrSubreddit(message: string): string | JSX.Element[] {
    if (/^.*((https:\/\/)|(\/?r\/)).*$/.test(message)) {
      return linkifyMessageContent(message);
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
        linkifyMessageContentIfMessageContainsUrlOrSubreddit(props.message)
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
