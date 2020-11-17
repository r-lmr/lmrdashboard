import { useEffect, useState } from "react";
import DuccStats, { IDucc } from "./DuccStats";
import eventSource from "../data/EventSource";

export default function DuccFriendStatsList() {
  const [fetchedUsers, setFetchedUsers] = useState<IDucc[]>([
    { user: "Loading..." },
  ]);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener("duccScore", (e: any) => {
      const data = JSON.parse(e.data);
      console.log(data.duccScores);
      setFetchedUsers(data.duccScores.duccFriends);
    });
  }, []);

  return (
    <div>
      <div className={"userlist-header"}>Top 10 Ducc Befrienders: </div>
      <div className={"userlist-content"}>
        {fetchedUsers.map((user) => (
          <DuccStats key={user.user} user={user.user} duccs={user.duccs} />
        ))}
      </div>
    </div>
  );
}
