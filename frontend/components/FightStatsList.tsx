import React from 'react';
import FightStat, { IFightScore } from './FightStat';

export default function FightStatsList(props: IProps): JSX.Element {
  return (
    <div>
      <div>
        <p className={'duccstatslist-header'}>Top {props.type}:</p>
      </div>
      <div className={'duccstatslist-content'}>
        {props.type === ScoreType.WINS ?
          props.topWinners != null ? props.topWinners.map((fightScore) => (
            <FightStat key={fightScore.user} user={fightScore.user} wins={fightScore.wins} />
          )) : <p>Loading...</p> : 
          props.topLosers != null ? props.topLosers.map((fightScore) => (
            <FightStat key={fightScore.user} user={fightScore.user} losses={fightScore.losses} />
          )) : <p>Loading...</p>
        }
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
