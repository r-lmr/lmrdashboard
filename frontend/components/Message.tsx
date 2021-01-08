import userHash from '../data/UserHash';

export default function Message(props: IMessage) {

  /**
   * Parses for ACTION, which is sent when /me is used
   * @returns the message with either a colon or nothing prefixed
   */
  function formatMessage(): string {
    // Slice is needed to ignore an unrenderable character in front of ACTION
    if (props.message.slice(1).startsWith('ACTION')) {
      return props.message.replace('ACTION', '');
    }
    return `: ${props.message}`;
  }

  return (
    <div>
      [{props.dateCreated}] <span className={`nick-${userHash(props.nick) % 16}`}>{props.nick}</span>{formatMessage()}
    </div>
  );
}

export interface IMessage {
  nick: string;
  message: string;
  dateCreated: string;
}
