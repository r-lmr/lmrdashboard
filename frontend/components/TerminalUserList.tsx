import { Col, Container, Row } from 'reactstrap';
import TerminalBar from './TerminalBar';
import UserList from './UserList';

export default function Terminal(): JSX.Element {
  return (
    <>
      <TerminalBar title={'Online Users'} />
      <div className={'dashboard-container'}>
        <Container className="dashboard-container-inner">
          <Row>
            <Col md={12}>
              <UserList />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
