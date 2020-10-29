import { useEffect, useState } from 'react'
import User, { IUser } from './User'
import eventSource from "../data/EventSource";

export default function UserList() {
    const [fetchedUsers, setFetchedUsers] = useState<string[]>([]);

    useEffect(() => {
  	eventSource.onmessage = e => {
    		console.log('onmessage');
    		console.log(e);
  	}
  	eventSource.addEventListener('join', (e: any) => {
    		const data = JSON.parse(e.data);
		console.log(data)
		setFetchedUsers(data.users);
	});
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
