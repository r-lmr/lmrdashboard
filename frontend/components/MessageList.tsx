import Message from "./Message";
import { useEffect, useState } from "react";
import eventSource from "../data/EventSource";
import { IMessage } from "./Message";

export default function MessageList() {
  const [fetchedMessages, setFetchedMessages] = useState<IMessage[]>([
    { message: "Loading...", nick: "", dateCreated: "1970-01-01" },
  ]);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener("messages", (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedMessages(data.messages.reverse());
    });
  }, []);

  return (
    <div>
      <div className={"messagelist-header"}>
        Last 10 messages (
        {fetchedMessages[0] && new Date(fetchedMessages[0].dateCreated).toISOString().split("T")[0]}):
      </div>
      {fetchedMessages.map((message, index) => (
        <Message
          key={(message.dateCreated || Date.now())
            .toString()
            .concat(index.toString())}
          message={message.message}
          nick={message.nick}
          dateCreated={
            new Date(message.dateCreated).toLocaleString().split(" ")[1]
          }
        />
      ))}
    </div>
  );
}
