import { useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import FightStatsList, { ScoreType } from './FightStatsList';
import eventSource from '../data/EventSource';
import { IFightScore } from './FightStat';

export default function Terminal(): JSX.Element {
  const [fetchedTopWinnersAndLosers, setFetchedTopWinnersAndLosers] = useState<TopWinnersAndLosers>({
    topWinners: [{ user: 'Loading...' }],
    topLosers: [{ user: 'Loading...' }],
  });

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener('topWinnersAndLosers', (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedTopWinnersAndLosers(data.topWinnersAndLosers);
    });
  }, []);

  return (
    <>
      <Col md={6}>
        <FightStatsList type={ScoreType.WINS} topWinners={fetchedTopWinnersAndLosers.topWinners} />
      </Col>
      <Col md={6}>
        <FightStatsList type={ScoreType.LOSSES} topLosers={fetchedTopWinnersAndLosers.topLosers} />
      </Col>
    </>
  );
}

interface TopWinnersAndLosers {
  topWinners: IFightScore[];
  topLosers: IFightScore[];
}
