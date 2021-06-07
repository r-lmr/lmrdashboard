import React from 'react';
import { TTopWord } from './TopWords';
import TopWord from './TopWord';

export default function TopWordsList(props: IProps): JSX.Element {
  return (
    <>
      {props.topWords.map((topWord, index) => (
        <TopWord key={index.toString()} word={topWord.word} count={topWord.count} />
      ))}
    </>
  );
}

interface IProps {
  topWords: TTopWord[];
}
