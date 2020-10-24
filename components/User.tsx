export default function User(props: IProps) {
    const roleMap: Map<string, string> = new Map<string, string>([
        ["OP", "@"],
        ["HOP", "%"],
        ["LOP", "+"],
    ]);

    return <div>{props.role && roleMap.get(props.role)}{props.nick}</div>;
}

interface IProps {
    nick: string;
    role?: string;
}