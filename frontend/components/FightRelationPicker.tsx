import { useState } from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import { getEventSourceBaseUrl } from '../data/EventSource';
import { FaSearch } from 'react-icons/fa';

export default function FightRelationPicker(): JSX.Element {
  const [nick1, setNick1] = useState<string>('');
  const [nick2, setNick2] = useState<string>('');
  const [displayError, setDisplayError] = useState<boolean>(false);

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
        console.log(data);
      })
      .catch((e) => {
        console.error(e);
        setDisplayError(true);
        setTimeout(() => {
          setDisplayError(false);
        }, 10_000);
      });
  };

  return (
    <div>
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
    </div>
  );
}
