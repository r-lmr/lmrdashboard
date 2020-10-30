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
      setFetchedLines([
        { count: 2573, dateCreated: "2020-04-26" },
        { count: 69, dateCreated: "2020-04-20" },
        { count: 1337, dateCreated: "1969-12-31" },
      ]);
    });
  }, []);
  return (
    <div>
      <div className={"messagelist-header"}>Current Line Count:</div>
      {fetchedLines.map((line) => (
        <LineCount
          key={line.dateCreated || Date.now()}
          count={line.count}
          dateCreated={line.dateCreated}
          message={line.message}
        />
      ))}
    </div>
  );
}
