import { Col, Container, Row } from 'reactstrap';
import TerminalDuccStats from './TerminalDuccStats';
import TerminalLineCountStats from './TerminalLineCountStats';
import TerminalMessageList from './TerminalMessageList';
import TerminalTopWords from './TerminalTopWords';
import TerminalUserList from './TerminalUserList';
import Terminal from './Terminal';

export default function Dashboard(): JSX.Element {
  return (
    <Container className={'dashboard-container'}>
      <Row>
        <Col className={'dashboard-column-entry'}>
          <Terminal>
            <TerminalUserList />
          </Terminal>
        </Col>
        <Col className={'dashboard-column-entry'}>
          <Terminal containerStyle={{ maxWidth: '95%' }}>
            <TerminalLineCountStats />
          </Terminal>
        </Col>
        <Col className={'dashboard-column-entry'}>
          <Terminal>
            <TerminalTopWords />
          </Terminal>
        </Col>
      </Row>
      <Row>
        <Col md={8} className={'dashboard-column-entry'}>
          <Terminal rowStyle={{ marginTop: '1em' }}>
            <TerminalMessageList />
          </Terminal>
        </Col>
        <Col md={4} className={'dashboard-column-entry'}>
          <Terminal rowStyle={{ justifyContent: 'center', marginTop: '1em' }}>
            <TerminalDuccStats />
          </Terminal>
        </Col>
      </Row>
    </Container>
  );
}
