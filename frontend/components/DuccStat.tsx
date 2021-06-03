import {getNickCSSClass} from '../data/UserHash';

export default function DuccStat(props: IDuccStat): JSX.Element {
  return (
    <div>
      <span className={getNickCSSClass(props.user)}>{props.user}</span>:{' '}
      {props.duccs}
    </div>
  );
}

export interface IDuccStat {
  user: string;
  duccs?: string;
}
