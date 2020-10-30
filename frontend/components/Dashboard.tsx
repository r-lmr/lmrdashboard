import UserList from "../components/UserList";
import { Container, Row, Col } from 'reactstrap';
import MessageList from "./MessageList";
import LineCountList from "./LineCountList";

export default function Dashboard() {

    return (
        <div className={"dashboard-container"}>
            <Container>
                <Row>
                    <Col md>
                        <UserList/>
		    </Col>
		    <Col md>
			<LineCountList/>
		    </Col>
		</Row>
		<Row >
                    <Col md >
                        <MessageList></MessageList>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
