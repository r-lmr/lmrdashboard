import { useState } from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import { getEventSourceBaseUrl } from '../data/EventSource';
import { FaSearch } from 'react-icons/fa';
import { getNickCSSClass } from '../data/UserHash';

export default function FightRelationPicker(): JSX.Element {
  const [nick1, setNick1] = useState<string>('');
  const [nick2, setNick2] = useState<string>('');
  const [nick1Wins, setNick1Wins] = useState<number>(-1);
  const [nick2Wins, setNick2Wins] = useState<number>(-1);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [resultsAvailable, setResultsAvailable] = useState<boolean>(false);

  const handleSearchRequest = () => {
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
        setResultsAvailable(true);
      })
      .catch((e) => {
        console.error(e);
        setResultsAvailable(false);
        setDisplayError(true);
        setTimeout(() => {
          setDisplayError(false);
        }, 10_000);
      });
  };

  return (
    <div className={'fight-relation-picker-container'}>
      <InputGroup>
        <Input
          placeholder={'Nick 1'}
          onChange={(x) => {
            setNick1(x.target.value);
          }}
        />
        <Input
          placeholder={'Nick 2'}
          onChange={(x) => {
            setNick2(x.target.value);
          }}
        />
        <InputGroupAddon addonType="append">
          <Button onClick={handleSearchRequest}>
            <FaSearch />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {displayError && <div>No match found.</div>}
      {resultsAvailable && (
        <div className={'fight-relation-results'}>
          <div>
            {/*TODO: Move these replaces into the getNickCSSClass function itself*/}
            <span className={getNickCSSClass(nick1.replace(/[^a-zA-Z0-9]/g, ''))}>{nick1}'s</span> wins vs{' '}
            <span className={getNickCSSClass(nick2.replace(/[^a-zA-Z0-9]/g, ''))}>{nick2}</span>: <b>{nick1Wins}</b>
          </div>
          <div>
            <span className={getNickCSSClass(nick2.replace(/[^a-zA-Z0-9]/g, ''))}>{nick2}'s</span> wins vs{' '}
            <span className={getNickCSSClass(nick1.replace(/[^a-zA-Z0-9]/g, ''))}>{nick1}</span>: <b>{nick2Wins}</b>
          </div>
        </div>
      )}
    </div>
  );
}
