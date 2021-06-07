import React, { useEffect, useState } from 'react';
import eventSource from '../data/EventSource';
import { ILineCount } from './LineCount';
import LineCount from './LineCount';
import { Tooltip } from 'reactstrap';

export default function LineCountList(props: IProps): JSX.Element {
  const [fetchedLines, setFetchedLines] = useState<ILineCount[]>([{ message: 'Loading...' }]);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener(props.type, (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedLines(data.lineCounts);
    });
  }, []);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  function getHeadingString(): string {
    return props.type === LineCountListType.LAST_DAYS ? 'Line Counts' : 'Lines Scoreboard';
  }

  return (
    <div>
      <div>
        <p className={'linecount-header'}>
          {getHeadingString()}:{' '}
          <span className={'linecount-tooltip'} id="linecount-tooltip">
            ?
          </span>
        </p>
        <Tooltip placement="right" isOpen={tooltipOpen} target="linecount-tooltip" toggle={toggle}>
          Percentage = number of bot lines
        </Tooltip>
      </div>
      {fetchedLines.map((line, index) => (
        <LineCount
          key={(line.date || Date.now()).toString().concat(index.toString())}
          lineCount={line.lineCount}
          botLines={line.botLines}
          date={line.date}
          message={line.message}
        />
      ))}
    </div>
  );
}

interface IProps {
  type: LineCountListType.LAST_DAYS | LineCountListType.HIGH_SCORE;
}

export enum LineCountListType {
  LAST_DAYS = 'lineCountsLastDays',
  HIGH_SCORE = 'lineCountsHighScores',
}
