import { IUser } from "./User";

export default function Message(props: IMessage) {
    return <div>[{props.time}] {props.user && props.user.nick}: {props.text}</div>;
}

export interface IMessage {
    text: string;
    user?: IUser;
    time: string;
}
