import UserList from "../components/UserList";
import { Container, Row, Col } from "reactstrap";
import MessageList from "./MessageList";
import LineCountList from "./LineCountList";
import TopWords from "./TopWords";
import DuccStatsList, { ScoreType } from "./DuccStatsList";

export default function Dashboard() {
  return (
    <div className={"dashboard-container"}>
      <Container>
        <Row>
          <Col md>
            <DuccStatsList type={ScoreType.FRIENDS}/>
          </Col>
          <Col md>
            <DuccStatsList type={ScoreType.KILLERS}/>
          </Col>
        </Row>
        <Row>
          <Col md>
            <UserList />
          </Col>
          <Col md>
            <LineCountList />
          </Col>
        </Row>
        <Row>
          <Col md>
            <MessageList />
          </Col>
          <Col md>
            <TopWords />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
