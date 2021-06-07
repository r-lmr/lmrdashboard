import React from 'react';
import { Col } from 'reactstrap';
import DuccStatsList, { ScoreType } from './DuccStatsList';

export default function Terminal(): JSX.Element {
  return (
    <>
      <Col md={6}>
        <DuccStatsList type={ScoreType.FRIENDS} />
      </Col>
      <Col md={6}>
        <DuccStatsList type={ScoreType.KILLERS} />
      </Col>
    </>
  );
}
