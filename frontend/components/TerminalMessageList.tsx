import React from 'react';
import { Col } from 'reactstrap';
import MessageList from './MessageList';

export default function Terminal(): JSX.Element {
  return (
    <Col md={12}>
      <MessageList />
    </Col>
  );
}
