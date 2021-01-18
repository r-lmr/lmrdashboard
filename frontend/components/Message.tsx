import { getNickCSSClass } from '../data/UserHash';

export default function Message(props: IMessage): JSX.Element {

  /**
   * Returns a message formatted in the way irssi formats it for /me
   */
  function getFormattedActionMessage(): JSX.Element {
    return (<>
      [{props.dateCreated}] * <span className={getNickCSSClass(props.nick)}>{props.nick}</span>{props.message.replace('ACTION', '')}
    </>)
  }

  /**
   * Returns a message formatted in a normal <nick>: <message> format
   */
  function getFormattedNormalMessage(): JSX.Element {
    return (<>
      [{props.dateCreated}] <span className={getNickCSSClass(props.nick)}>{props.nick}</span>: {props.message}
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
