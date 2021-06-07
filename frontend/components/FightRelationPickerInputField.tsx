import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from 'reactstrap';

export default function FightRelationPickerInputField(props: IFightRelationPickerInputField): JSX.Element {
  return (
    <Input
      className={props.className}
      placeholder={props.placeHolder}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
    />
  );
}

interface IFightRelationPickerInputField {
  className: string;
  placeHolder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}
