export default function User(props: IUser) {
  const roleMap: Map<string, string> = new Map<string, string>([
    ["OP", "@"],
    ["HOP", "%"],
    ["LOP", "+"],
  ]);

  return (
    <div>
      {props.role && roleMap.get(props.role)}
      {props.nick}
    </div>
  );
}

export interface IUser {
  nick: string;
  role?: string;
}
