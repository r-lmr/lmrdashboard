import { Col, Container, Row } from 'reactstrap';
import TopWords from './TopWords';
import TerminalBar from './TerminalBar';

export default function Terminal(): JSX.Element {
  return (
    <>
      <TerminalBar title={'Current Top Words'} />
      <div className={'terminal-container'}>
        <Container className='terminal-container-inner'>
          <Row>
            <Col md={12}>
              <TopWords />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
