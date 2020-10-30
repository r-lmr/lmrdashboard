import Message from "./Message";
import { useEffect, useState } from "react";
import eventSource from "../data/EventSource";
import { IMessage } from "./Message";

export default function MessageList() {
  const [fetchedMessages, setFetchedMessages] = useState<IMessage[]>([
    { message: "Loading..." },
  ]);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log("onmessage");
      console.log(e);
    };
    eventSource.addEventListener("join", (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedMessages(data.messages.reverse());
    });
  }, []);
  return (
    <div>
      <div className={"messagelist-header"}>Last 5 messages:</div>
      {fetchedMessages.map((message) => (
        <Message
          key={message.dateCreated || Date.now()}
          message={message.message}
          nick={message.nick}
          dateCreated={message.dateCreated}
        />
      ))}
    </div>
  );
}
