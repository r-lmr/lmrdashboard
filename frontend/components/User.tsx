import userHash from "../data/UserHash";

export default function User(props: IUser) {
  return (
    <div>
      <span className={`nick-${userHash(props.nick) % 16}`}>{props.nick}</span>
    </div>
  );
}

export interface IUser {
  nick: string;
}
