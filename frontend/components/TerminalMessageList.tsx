import { Col, Container, Row } from 'reactstrap';
import MessageList from './MessageList';
import TerminalBar from './TerminalBar';

export default function Terminal(): JSX.Element {
  return (
    <>
      <TerminalBar title={'Last Messages'} />
      <div className={'dashboard-container'}>
        <Container className='dashboard-container-inner'>
          <Row style={{ marginTop: '1em' }}>
            <Col md={12}>
              <MessageList />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
