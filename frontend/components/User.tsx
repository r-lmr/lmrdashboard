import { getNickCSSClass } from '../data/UserHash';

export default function User(props: IUser): JSX.Element {
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
