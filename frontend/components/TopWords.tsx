import eventSource from "../data/EventSource";
import { useEffect, useState } from "react";
import TopWord from "./TopWord";
export default function TopWords() {

  const [fetchedTopWords, setFetchedTopWords] = useState<TTopWord[]>([]);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener("topWords", (e: any) => {
      const data = JSON.parse(e.data);
      const topWords: TTopWord[] = (data.topWords);
      setFetchedTopWords(topWords);
    });
  }, []);

  return (
    <>
      <div className={"topwords-header"}>Current top words:</div>
      {/* TODO: Maybe split this up into two colums if we display 10 words */}
      {Array.from(fetchedTopWords).map((topWord, index) => (
        <TopWord
          key={topWord[0].concat(index.toString())}
          word={topWord[0]}
          count={topWord[1]}
        />
      ))}
    </>
  )
}

type TTopWord = [string, number];