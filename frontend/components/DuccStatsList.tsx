import React, { useEffect, useState } from "react";
import eventSource from "../data/EventSource";
import DuccStat, { IDuccStat } from "./DuccStat";

export default function DuccStatsList(props: IProps) {
  const [fetchedStats, setFetchedStats] = useState<IDuccStat[]>([
    { user: "Loading..." },
  ]);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener("duccScore", (e: any) => {
      const data = JSON.parse(e.data);
      console.log(data.duccScores);
      setFetchedStats(data.duccScores[props.type]);
    });
  }, []);

  return (
    <div>
      <div className={"duccstatslist-header"}>
        Top 10 ducc{" "}
        {props.type === ScoreType.FRIENDS ? "friends" : "killers"}:{" "}
      </div>
      <div className={"duccstatslist-content"}>
        {fetchedStats.map((duccStat) => (
          <DuccStat
            key={duccStat.user}
            user={duccStat.user}
            duccs={duccStat.duccs}
          />
        ))}
      </div>
    </div>
  );
}

interface IProps {
  type: ScoreType.FRIENDS | ScoreType.KILLERS;
}

export enum ScoreType {
  FRIENDS = "duccFriends",
  KILLERS = "duccKillers",
}
