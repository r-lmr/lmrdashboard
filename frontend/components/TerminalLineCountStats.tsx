import React from 'react';
import { Col } from 'reactstrap';
import LineCountList, { LineCountListType } from './LineCountList';

export default function Terminal(): JSX.Element {
  return (
    <>
      <Col md={6}>
        <LineCountList type={LineCountListType.LAST_DAYS} />
      </Col>
      <Col md={6}>
        <LineCountList type={LineCountListType.HIGH_SCORE} />
      </Col>
    </>
  );
}
