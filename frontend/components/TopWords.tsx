import eventSource from "../data/EventSource";
import { useEffect, useState } from "react";
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
      <div className={"topwords-header"}>Top words of the week:</div>
      <span>Placeholder</span>
      <div>Linux</div>
      <div>Open-source</div>
      <div>...</div>
    </>
  )
}