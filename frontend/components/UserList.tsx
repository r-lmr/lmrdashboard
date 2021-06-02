import { useEffect, useState } from 'react';
import User from './User';
import eventSource from '../data/EventSource';

export default function UserList(): JSX.Element {
  const [fetchedUsers, setFetchedUsers] = useState<string[]>(['Loading...']);

  useEffect(() => {
    eventSource.onmessage = (e) => {
      console.log(e);
    };
    eventSource.addEventListener('users', (e: any) => {
      const data = JSON.parse(e.data);
      setFetchedUsers(data.users);
    });
  }, []);

  return (
    <div>
      <div className={'userlist-header'}>Online Users: ({fetchedUsers.length})</div>
      <div className={'userlist-content'}>
        {fetchedUsers.map((user) => (
          <User key={user} nick={user} />
        ))}
      </div>
    </div>
  );
}
