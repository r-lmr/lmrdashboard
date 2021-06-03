import { useState } from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import { getEventSourceBaseUrl } from '../data/EventSource';

export default function FightRelationPicker(): JSX.Element {
  const [nick1, setNick1] = useState<string>('');
  const [nick2, setNick2] = useState<string>('');

  const handleSearchRequest = () => {
    console.log(nick1);
    console.log(nick2);

    if (nick1.length === 0 || nick2.length === 0) {
      return;
    }

    fetch(getEventSourceBaseUrl() + `/fightRelation?nick1=${nick1}&nick2=${nick2}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          const msg = response.statusText;
          throw new Error('Failed to get fightRelation. ' + msg);
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => console.error(e));
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
          <Button onClick={handleSearchRequest}>Search</Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
