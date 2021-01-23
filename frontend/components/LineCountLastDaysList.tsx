import React, { useEffect, useState } from 'react';
import eventSource from '../data/EventSource';
import { ILineCount } from './LineCount';
import LineCount from './LineCount';
import { Tooltip } from 'reactstrap';

export default function LineCountList(props: IProps) {
  const [fetchedLines, setFetchedLines] = useState<ILineCount[]>([{ message: 'Loading...' }]);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener(props.type, (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedLines(data.lineCounts);
    });
  }, []);

  return (
    <div>
      <div>
        <p className={'messagelist-header'}>Line Count: <span className={'messagelist-tooltip'} id="messagelist-tooltip">?</span></p>
        <Tooltip placement="right" isOpen={tooltipOpen} target="messagelist-tooltip" toggle={toggle}>
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
  HIGH_SCORE = 'lineCountsHighScores'
}
