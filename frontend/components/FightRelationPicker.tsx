import React from 'react';
import { useRef, useState, KeyboardEvent, ChangeEvent } from 'react';
import { InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { getEventSourceBaseUrl } from '../data/EventSource';
import { FaSearch } from 'react-icons/fa';
import FightRelationPickerInputField from './FightRelationPickerInputField';
import FightRelationPickerResults from './FightRelationPickerResults';

export default function FightRelationPicker(): JSX.Element {
  const [nick1, setNick1] = useState<string>('');
  const [nick2, setNick2] = useState<string>('');
  const [nick1Wins, setNick1Wins] = useState<number>(-1);
  const [nick2Wins, setNick2Wins] = useState<number>(-1);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [resultsAvailable, setResultsAvailable] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [resultNick1, setResultNick1] = useState<string>('');
  const [resultNick2, setResultNick2] = useState<string>('');

  const handleSearchRequest = (): void => {
    if (nick1.length === 0 || nick2.length === 0) {
      return;
    }

    fetch(getEventSourceBaseUrl() + `/fightRelation?nick1=${nick1}&nick2=${nick2}`)
      .then((response) => {
        if (response.ok) {
          setDisplayError(false);
          return response.json();
        } else {
          const msg = response.statusText;
          throw new Error('Failed to get fightRelation. ' + msg);
        }
      })
      .then((data) => {
        setNick1Wins(data.nick1Wins);
        setNick2Wins(data.nick2Wins);
        setResultNick1(data.nick1Full);
        setResultNick2(data.nick2Full);
        setResultsAvailable(true);
      })
      .catch((e) => {
        console.error(e);
        setResultsAvailable(false);
        setDisplayError(true);
        setTimeout(() => {
          setDisplayError(false);
        }, 5_000);
      });
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      (buttonRef.current?.children[0] as HTMLButtonElement).click();
    }
  };

  return (
    <div className={'fight-relation-picker-container'}>
      <InputGroup>
        <FightRelationPickerInputField
          className={'input-nick1'}
          placeHolder={'Nick 1'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNick1(e.target.value)}
          onKeyDown={handleOnKeyDown}
        />
        <FightRelationPickerInputField
          className={'input-nick2'}
          placeHolder={'Nick 2'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNick2(e.target.value)}
          onKeyDown={handleOnKeyDown}
        />
        <InputGroupAddon addonType={'append'}>
          <div ref={buttonRef}>
            <Button className={'fight-relation-picker-button'} onClick={handleSearchRequest}>
              <FaSearch className={'fight-relation-picker-button-icon'} />
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
      {displayError && <div className={'fight-relation-error'}>No match found.</div>}
      {resultsAvailable && (
        <FightRelationPickerResults
          nick1={resultNick1}
          nick2={resultNick2}
          nick1Wins={nick1Wins}
          nick2Wins={nick2Wins}
        />
      )}
    </div>
  );
}
