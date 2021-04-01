import { TTopWord } from './TopWords';
import TopWord from './TopWord';

export default function TopWordsList(props: IProps) {
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
