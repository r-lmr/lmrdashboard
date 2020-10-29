import UserList from "../components/UserList";
import { Container, Row, Col } from 'reactstrap';
import MessageList from "./MessageList";

export default function Dashboard() {

    return (
        <div className={"dashboard-container"}>
            <Container>
                <Row>
                    <Col xs={"auto"}>
                        <UserList></UserList>
                    </Col>
                    <Col xs={"auto"}>
                        <MessageList></MessageList>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
