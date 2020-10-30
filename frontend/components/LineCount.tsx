export default function LineCount(props: ILines) {
    return <div>[{ props.dateCreated && new Date(props.dateCreated).toDateString()}]: {props.count}{props.message}</div>;
}

export interface ILines {
    count?: number
    dateCreated?: string
    message?: string
}

