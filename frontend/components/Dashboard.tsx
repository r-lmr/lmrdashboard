import UserList from '../components/UserList';
import { Container, Row, Col } from 'reactstrap';
import MessageList from './MessageList';
import LineCountLastDaysList from './LineCountLastDaysList';
import LineCountHighScoresList from './LineCountHighScoresList';
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
            <Col md={2}>
              <LineCountLastDaysList />
            </Col>
            <Col md={2}>
              <LineCountHighScoresList />
            </Col>
            <Col md={2}>
              <DuccStatsList type={ScoreType.FRIENDS} />
            </Col>
            <Col md={3}>
              <DuccStatsList type={ScoreType.KILLERS} />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <MessageList />
            </Col>
            <Col md={4}>
              <TopWords />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
