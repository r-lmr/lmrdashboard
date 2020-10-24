import User from './User'
export default function UserList(props: IProps) {

    return (
        <div>
            <div className={"userlist-header"}>
                Online users:
            </div>
            {props.users.map((user) =>
                <User key={user.nick}
                    nick={user.nick}
                    role={user.role} />)}
        </div>
    )
}

interface IUser {
    nick: string;
    role?: string;
}

interface IProps {
    users: IUser[]
}
