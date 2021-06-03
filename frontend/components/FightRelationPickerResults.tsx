import { getNickCSSClass } from '../data/UserHash';

export default function FightRelationPickerResults(props: IFightRelationPickerResults): JSX.Element {
  return (
    <div className={'fight-relation-results'}>
      <div>
        <span className={getNickCSSClass(props.nick1)}>{props.nick1}'s</span> wins vs{' '}
        <span className={getNickCSSClass(props.nick2)}>{props.nick2}</span>: <b>{props.nick1Wins}</b>
      </div>
      <div>
        <span className={getNickCSSClass(props.nick2)}>{props.nick2}'s</span> wins vs{' '}
        <span className={getNickCSSClass(props.nick1)}>{props.nick1}</span>: <b>{props.nick2Wins}</b>
      </div>
    </div>
  );
}

interface IFightRelationPickerResults {
  nick1: string;
  nick2: string;
  nick1Wins: number;
  nick2Wins: number;
}
