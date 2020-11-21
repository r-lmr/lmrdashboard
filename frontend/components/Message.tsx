import userHash from "../data/UserHash";

export default function Message(props: IMessage) {
  return (
    <div>
      [{props.dateCreated}]{" "}
      <span className={`nick-${userHash(props.nick) % 16}`}>{props.nick}</span>:{" "}
      {props.message}
    </div>
  );
}

export interface IMessage {
  nick: string;
  message: string;
  dateCreated: string;
}
