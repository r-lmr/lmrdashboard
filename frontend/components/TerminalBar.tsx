export default function TerminalBar(props: IProps): JSX.Element {
  return (
      <div className={'terminal-bar'}>
        <div className={'terminal-buttons'}>
          <div className={'terminal-button exit'} onClick={props.onButtonClick}></div>
          <div className={'terminal-button maximize'}></div>
          <div className={'terminal-button minimize'} onClick={props.onButtonClick}></div>
        </div>
        {props.title || 'irc - #linuxmasterrace'}
      </div>
  );
}

interface IProps {
  title?: string;
  onButtonClick: () => void;
}
