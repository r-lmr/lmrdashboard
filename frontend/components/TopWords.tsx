import eventSource from '../data/EventSource';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TopWordsList from './TopWordList';

export default function TopWords() {
  const [fetchedTopWords, setFetchedTopWords] = useState<TTopWord[]>([]);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener('topWords', (e: any) => {
      const data = JSON.parse(e.data);
      const topWords: TTopWord[] = data.topWords;
      setFetchedTopWords(topWords);
    });
  }, []);

  return (
    <>
      <div className={'topwords-header'}>Current Top Words:</div>
      <Container fluid={'nogutters'}>
        <Row>
          <Col className={'topwords-column'} md={6}>
            <TopWordsList topWords={fetchedTopWords.slice(0, Math.floor(fetchedTopWords.length / 2))} />
          </Col>
          <Col className={'topwords-column'} md={6}>
            <TopWordsList
              topWords={fetchedTopWords.slice(Math.floor(fetchedTopWords.length / 2), fetchedTopWords.length)}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export type TTopWord = {
  word: string;
  count: number;
};
