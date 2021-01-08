import {getNickCSSClass} from '../data/UserHash';

export default function DuccStat(props: IDuccStat) {
  return (
    <div>
      <span className={getNickCSSClass(props.user.replace(/[^a-zA-Z0-9]/g, ''))}>{props.user}</span>:{' '}
      {props.duccs}
    </div>
  );
}

export interface IDuccStat {
  user: string;
  duccs?: string;
}
