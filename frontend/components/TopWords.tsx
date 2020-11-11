import eventSource from "../data/EventSource";
import { useEffect, useState } from "react";
import TopWord from "./TopWord";
export default function TopWords() {

  const [fetchedTopWords, setFetchedTopWords] = useState<Map<string, number>>(new Map<string, number>());

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener("topWords", (e: any) => {
      const data = JSON.parse(e.data);
      const topWords = new Map<string, number>(data.topWords);
      setFetchedTopWords(topWords);
    });
  }, []);

  return (
    <>
      <div className={"topwords-header"}>Current top words:</div>
      {/* TODO: Maybe split this up into two colums if we display 10 words */}
      {Array.from(fetchedTopWords.keys()).map((word, index) => (
        <TopWord
          key={word.concat(index.toString())}
          word={word}
          count={fetchedTopWords.get(word)!}
        />
      ))}
    </>
  )
}