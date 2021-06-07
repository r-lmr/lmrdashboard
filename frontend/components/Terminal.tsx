import React, { useState } from 'react';
import { Container, Row } from 'reactstrap';
import TerminalBar from './TerminalBar';

export default function Terminal(props: IProps): JSX.Element {
  const [containerVisible, setContainerVisible] = useState<boolean>(true);

  const onTerminalButtonClick = () => {
    setContainerVisible(!containerVisible);
  };

  return (
    <>
      <TerminalBar title={props.title} onButtonClick={onTerminalButtonClick} />
      <div className={'terminal-container'} style={{ display: containerVisible ? '' : 'none' }}>
        <Container className="terminal-container-inner" style={props.containerStyle}>
          <Row style={props.rowStyle}>{props.children}</Row>
        </Container>
      </div>
    </>
  );
}

interface IProps {
  children: React.ReactNode;
  title: string;
  containerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
}
