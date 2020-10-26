import Message from './Message'
import { IMessage } from './Message'

export default function MessageList(props: IProps) {

    return (
        <div>
            <div className={"messagelist-header"}>
                Last 5 messages:
            </div>
            {props.messages.map((message) =>
                <Message key={message.time}
                    text={message.text}
                    user={message.user}
                    time={message.time}
                     />)}
        </div>
    )
}

interface IProps {
    messages: IMessage[]
}
