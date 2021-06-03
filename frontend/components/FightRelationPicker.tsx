import { useState } from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

export default function FightRelationPicker(): JSX.Element {
  const [nick1, setNick1] = useState<string>('');
  const [nick2, setNick2] = useState<string>('');

  const handleSearchRequest = () => {
    console.log(nick1);
    console.log(nick2);
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
