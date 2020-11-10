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
      console.log(e);
    };
    eventSource.addEventListener("messages", (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedMessages(data.messages.reverse());
    });
  }, []);
  return (
    <div>
      <div className={"messagelist-header"}>Last 5 messages:</div>
      {fetchedMessages.map((message, index) => (
        <Message
          // Temporary key fix to make key unique if messages with the same date are sent
          key={(message.dateCreated || Date.now())
            .toString()
            .concat(index.toString())}
          message={message.message}
          nick={message.nick}
          dateCreated={message.dateCreated}
        />
      ))}
    </div>
  );
}
