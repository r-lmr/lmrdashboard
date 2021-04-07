import UserList from './UserList';
import { Container, Row, Col } from 'reactstrap';
import MessageList from './MessageList';
import LineCountList, { LineCountListType } from './LineCountList';
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
        <Container className='dashboard-container-inner'>
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
