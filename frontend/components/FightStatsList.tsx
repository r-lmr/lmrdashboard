import React from 'react';
import FightStat, { IFightScore } from './FightStat';

export default function FightStatsList(props: IProps): JSX.Element {
  return (
    <div>
      <div>
        <p className={'fightstatslist-header'}>Top {props.type}:</p>
      </div>
      <div className={'fightstatslist-content'}>
        {props.type === ScoreType.WINS
          ? props.topWinners &&
            props.topWinners.map((fightScore) => (
              <FightStat key={fightScore.user} user={fightScore.user} wins={fightScore.wins} />
            ))
          : props.topLosers &&
            props.topLosers.map((fightScore) => (
              <FightStat key={fightScore.user} user={fightScore.user} losses={fightScore.losses} />
            ))}
      </div>
    </div>
  );
}

interface IProps {
  type: ScoreType;
  topWinners?: IFightScore[];
  topLosers?: IFightScore[];
}

export enum ScoreType {
  WINS = 'Wins',
  LOSSES = 'Losses',
}
