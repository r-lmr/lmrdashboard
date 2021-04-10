import React, { useEffect, useState } from 'react';
import eventSource from '../data/EventSource';
import DuccStat, { IDuccStat } from './DuccStat';
import { Tooltip } from 'reactstrap';

export default function DuccStatsList(props: IProps): JSX.Element {
  const [fetchedStats, setFetchedStats] = useState<IDuccStat[]>([{ user: 'Loading...' }]);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener('duccScore', (e: any) => {
      const data = JSON.parse(e.data);
      console.log(data.duccScores);
      setFetchedStats(data.duccScores[props.type]);
    });
  }, []);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <div>
      <div>
        <p className={'duccstatslist-header'}>Top Ducc {props.type === ScoreType.FRIENDS ? 'Friends' : 'Killers'}: <span className={'duccstatslist-tooltip'} id="duccstatslist-tooltip">?</span></p>
        <Tooltip placement="right" isOpen={tooltipOpen} target="duccstatslist-tooltip" toggle={toggle}>
          Generated weekly
        </Tooltip>
      </div>
      <div className={'duccstatslist-content'}>
        {fetchedStats.map((duccStat) => (
          <DuccStat key={duccStat.user} user={duccStat.user} duccs={duccStat.duccs} />
        ))}
      </div>
    </div>
  );
}

interface IProps {
  type: ScoreType.FRIENDS | ScoreType.KILLERS;
}

export enum ScoreType {
  FRIENDS = 'duccFriends',
  KILLERS = 'duccKillers',
}
