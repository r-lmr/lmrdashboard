import UserList from "../components/UserList";
import MockData from "../data/mock.json";
import { Container, Row, Col } from 'reactstrap';
import MessageList from "./MessageList";
import { subscribeToTimer } from '../util/socketclient'
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [timestamp, setTimeStamp] = useState<Date>(new Date());

    useEffect(() => {
        subscribeToTimer((timestamp: Date) => {
            setTimeStamp(timestamp);
        })
    }, [])

    return (
        <div className={"dashboard-container"}>
            <div>
                Last updated: {timestamp.toString()}
            </div>
            <Container>
                <Row>
                    <Col xs={"auto"}>
                        <UserList></UserList>
                    </Col>
                    <Col xs={"auto"}>
                        <MessageList messages={MockData.messages}></MessageList>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}