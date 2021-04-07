import { Col, Container, Row } from 'reactstrap';
import TerminalDuccStats from './TerminalDuccStats';
import TerminalLineCountStats from './TerminalLineCountStats';
import TerminalMessageList from './TerminalMessageList';
import TerminalTopWords from './TerminalTopWords';
import TerminalUserList from './TerminalUserList';

export default function Dashboard(): JSX.Element {
  return (
    <Container style={{ maxWidth: '100%' }}>
      <Row>
        <Col className={'dashboard-column-entry'}>
          <TerminalUserList />
        </Col>
        <Col className={'dashboard-column-entry'}>
          <TerminalLineCountStats />
        </Col>
        <Col className={'dashboard-column-entry'}>
          <TerminalTopWords />
        </Col>
      </Row>
      <Row>
        <Col md={8} className={'dashboard-column-entry'} >
          <TerminalMessageList />
        </Col>
        <Col md={4} className={'dashboard-column-entry'} >
          <TerminalDuccStats />
        </Col>
      </Row>
    </Container>
  );
}
