import UserList from '../components/UserList';
import { Container, Row, Col } from 'reactstrap';
import MessageList from './MessageList';
import LineCountList, { LineCountListType } from './LineCountLastDaysList';
import TopWords from './TopWords';
import DuccStatsList, { ScoreType } from './DuccStatsList';

export default function Dashboard() {
  return (
    <>
      <div className={'terminal-bar'}>
        <div className={'terminal-buttons'}>
          <div className={'terminal-button exit'}></div>
          <div className={'terminal-button maximize'}></div>
          <div className={'terminal-button minimize'}></div>
        </div>
        irc - #linuxmasterrace
      </div>
      <div className={'dashboard-container'}>
        <Container>
          <Row>
            <Col md={3}>
              <UserList />
            </Col>
            <Col md={3}>
              <LineCountList type={LineCountListType.LAST_DAYS}/>
            </Col>
            <Col md={3}>
              <LineCountList type={LineCountListType.HIGH_SCORE}/>
            </Col>
            <Col md={3}>
              <TopWords />
            </Col>
          </Row>
          <Row style={{ justifyContent: 'center', marginTop: '1em' }}>
            <Col md={4}>
              <DuccStatsList type={ScoreType.FRIENDS} />
            </Col>
            <Col md={4}>
              <DuccStatsList type={ScoreType.KILLERS} />
            </Col>
          </Row>
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
