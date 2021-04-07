import { Col } from 'reactstrap';
import UserList from './UserList';

export default function Terminal(): JSX.Element {
  return (
    <Col md={12}>
      <UserList />
    </Col>
  );
}
