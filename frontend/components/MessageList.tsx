import Message from './Message'
import { IMessage } from './Message'
import { useEffect, useState } from "react";
import eventSource from "../data/EventSource";

export default function MessageList() {
    const [fetchedMessages, setFetchedMessages] = useState<string[]>([]);

    useEffect(() => {
        eventSource.onmessage = e => {
                console.log('onmessage');
                console.log(e);
        }
        eventSource.addEventListener('join', (e: any) => {
                const data = JSON.parse(e.data);
		setFetchedMessages(data.messages);
        });
    }, [])
    return (
        <div>
            <div className={"messagelist-header"}>
                Last 5 messages:
            </div>
            {fetchedMessages.map((message: any) =>
                <Message key={message.dateCreated}
                    text={message.message}
                    user={message.nick}
                    time={message.dateCreated}
                     />)}
        </div>
    )
}

interface IProps {
    messages: IMessage[]
}
