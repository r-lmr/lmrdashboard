import { useEffect, useState } from "react";
import eventSource from "../data/EventSource";
import { ILines } from "./LineCount";
import LineCount from "./LineCount";

export default function LineCountList() {
  const [fetchedLines, setFetchedLines] = useState<ILines[]>([
    { message: "Loading..." },
  ]);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log("onmessage");
      console.log(e);
    };
    eventSource.addEventListener("join", (e: any) => {
      const data = JSON.parse(e.data);
      console.log(data.lineCount);
      setFetchedLines(data.lineCount);
    });
  }, []);
  return (
    <div>
      <div className={"messagelist-header"}> Current Line Count : </div>
      {fetchedLines.map((line) => (
        <LineCount
          key={line.date || Date.now()}
          lineCount={line.lineCount}
          date={line.date}
          message={line.message}
        />
      ))}
    </div>
  );
}
