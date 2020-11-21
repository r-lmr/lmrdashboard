import userHash from "../data/UserHash";

export default function User(props: IUser) {
  const roleMap: Map<string, string> = new Map<string, string>([
    ["OP", "@"],
    ["HOP", "%"],
    ["LOP", "+"],
  ]);

  return (
    <div>
      {props.role && roleMap.get(props.role)}
      <span className={`nick-${Math.abs(userHash(props.nick)%16)}`}>{props.nick}</span>
    </div>
  );
}

export interface IUser {
  nick: string;
  role?: string;
}
