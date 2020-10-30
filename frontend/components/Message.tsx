export default function Message(props: IMessage) {
  return (
    <div>
      [{props.dateCreated}] {props.nick}: {props.message}
    </div>
  );
}

export interface IMessage {
  nick?: string;
  message: string;
  dateCreated?: string;
}
