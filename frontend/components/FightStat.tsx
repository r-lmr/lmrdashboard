import React from 'react';
import {getNickCSSClass} from '../data/UserHash';

export default function FightStat(props: IFightScore): JSX.Element {
  return (
    <div>
      <span className={getNickCSSClass(props.user)}>{props.user}</span>:{' '}
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
