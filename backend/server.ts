import Express from 'express';
import myEmitter from './ircconnection/utils/emitter';
import { getUsers, deleteUser, addUser } from './ircconnection/utils/db/Users';

//const emitter = myEmitter();
const app = Express();

app.get('/', async (req, res) => {
	console.log('Hit the route');
	myEmitter.emit('users', req);
})

myEmitter.on('join', (server: string, nick: string) => { 
      console.log("Hello there!");
});


app.listen(3000, () => {console.log('listening on 3000')})
