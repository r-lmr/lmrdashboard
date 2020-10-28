import { useEffect, useState } from 'react'
import User, { IUser } from './User'
export default function UserList() {
    const [fetchedUsers, setFetchedUsers] = useState<string[]>([]);

    useEffect(() => {
        fetch("http://localhost:4000/onlineUsers")
            .then(res => res.json())
            .then(
                (result) => {
                    setFetchedUsers(result.users);
                },
                (error) => {
                    console.error(error);
                }
            )

    }, [])

    return (
        <div>
            <div className={"userlist-header"}>
                Online users:
            </div>
            {fetchedUsers.map((user) =>
                <User key={user}
                    nick={user} />)}
        </div>
    )
}