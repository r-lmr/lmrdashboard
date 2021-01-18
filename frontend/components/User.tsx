import { getNickCSSClass } from '../data/UserHash';

export default function User(props: IUser) {
  const roleMap: Map<string, string> = new Map<string, string>([
    ['OP', '@'],
    ['HOP', '%'],
    ['LOP', '+'],
  ]);

  return (
    <div>
      <span className={getNickCSSClass(props.nick[0].match(/[+|@|%]/) ? props.nick.substring(1) : props.nick)}>
        {props.nick}
      </span>
    </div>
  );
}

export interface IUser {
  nick: string;
}
