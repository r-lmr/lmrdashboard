import { TTopWord } from "./TopWords";
import TopWord from "./TopWord";

export default function TopWordsList(props: IProps) {

  return (
    <>
      {Array.from(props.topWords).map((topWord, index) => (
        <TopWord
          key={topWord[0].concat(index.toString())}
          word={topWord[0]}
          count={topWord[1]}
        />
      ))}

    </>
  )
}

interface IProps {
  topWords: TTopWord[]
}