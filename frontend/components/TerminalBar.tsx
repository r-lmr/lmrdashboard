import React from 'react';

export default function TerminalBar(props: IProps): JSX.Element {
  return (
    <div className={'terminal-bar'}>
      <div className={'terminal-buttons'}>
        <div className={'terminal-button exit hoverable'} onClick={props.onButtonClick}></div>
        <div className={'terminal-button maximize hoverable'}></div>
        <div className={'terminal-button minimize hoverable'} onClick={props.onButtonClick}></div>
      </div>
      {props.title || 'irc - #linuxmasterrace'}
    </div>
  );
}

interface IProps {
  title?: string;
  onButtonClick: () => void;
}
