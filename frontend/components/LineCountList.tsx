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
      console.log(e);
    };
    eventSource.addEventListener("lineCounts", (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedLines(data.lineCounts);
    });
  }, []);
  return (
    <div>
      <div className={"messagelist-header"}> Current Line Count : </div>
      {fetchedLines.map((line, index) => (
        <LineCount
          key={(line.date || Date.now())
            .toString()
            .concat(index.toString())}
          lineCount={line.lineCount}
          date={line.date}
          message={line.message}
        />
      ))}
    </div>
  );
}
