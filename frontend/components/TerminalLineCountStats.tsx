import { Col, Container, Row } from 'reactstrap';
import LineCountList, { LineCountListType } from './LineCountList';
import TerminalBar from './TerminalBar';

export default function Terminal(): JSX.Element {
  return (
    <>
      <TerminalBar title={'Line Counts'} />
      <div className={'dashboard-container'}>
        <Container className='dashboard-container-inner' style={{maxWidth: '95%'}}>
          <Row>
            <Col md={6}>
              <LineCountList type={LineCountListType.LAST_DAYS}/>
            </Col>
            <Col md={6}>
              <LineCountList type={LineCountListType.HIGH_SCORE}/>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
