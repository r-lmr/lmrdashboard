import { Container, Row } from 'reactstrap';
import TerminalBar from './TerminalBar';

export default function Terminal(props: IProps): JSX.Element {
  return (
    <>
      <TerminalBar title={'Online Users'} />
      <div className={'terminal-container'}>
        <Container className='terminal-container-inner' style={props.containerStyle}>
          <Row style={props.rowStyle}>
            {props.children}
          </Row>
        </Container>
      </div>
    </>
  );
}

interface IProps {
  children: React.ReactNode;
  containerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
}
