import {getNickCSSClass} from '../data/UserHash';

export default function FightStat(props: IFightStat): JSX.Element {
  return (
    <div>
      <span className={getNickCSSClass(props.user.replace(/[^a-zA-Z0-9]/g, ''))}>{props.user}</span>:{' '}
      {props.wins && props.wins}
      {props.losses && props.losses}
    </div>
  );
}

export interface IFightScore {
  user: string;
  wins?: number;
  losses?: number;
}
