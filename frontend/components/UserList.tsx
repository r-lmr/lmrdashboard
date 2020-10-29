import { useEffect, useState } from 'react'
import User, { IUser } from './User'
export default function UserList() {
    const [fetchedUsers, setFetchedUsers] = useState<string[]>([]);

    useEffect(() => {
      	const eventSource = new EventSource("http://localhost:4000/test");
  	eventSource.onmessage = e => {
    		console.log('onmessage');
    		console.log(e);
  	}
  	eventSource.addEventListener('join', (e: any) => {
    		console.log(e.data, e)
		setFetchedUsers(JSON.parse(e.data));
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
