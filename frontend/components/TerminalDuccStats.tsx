import { Col, Container, Row } from 'reactstrap';
import DuccStatsList, { ScoreType } from './DuccStatsList';
import TerminalBar from './TerminalBar';

export default function Terminal(): JSX.Element {
  return (
    <>
      <TerminalBar title={'Ducc Stats'} />
      <div className={'terminal-container'}>
        <Container className='terminal-container-inner'>
          <Row style={{ justifyContent: 'center', marginTop: '1em' }}>
            <Col md={6}>
              <DuccStatsList type={ScoreType.FRIENDS} />
            </Col>
            <Col md={6}>
              <DuccStatsList type={ScoreType.KILLERS} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
