import Express from 'express';
import cors from 'cors';
import './ircconnection/app';
import myEmitter from './ircconnection/utils/emitter';
import { getUsers, deleteUser, addUser, flushUserTable } from './ircconnection/utils/db/Users';

//const emitter = myEmitter();
const app = Express();
app.use(cors())


app.get('/', async (req, res) => {
	myEmitter.on('join', async (server: string, nick: string) => {
		await addUser(nick, server);
		const users = await getUsers(server);
		res.write(`${JSON.stringify({user: users})}\n\n`);
		console.log("FROM GET ROUTE", server, nick);
	});
	myEmitter.on('part', async (server: string, nick: string) => {
                await deleteUser(nick, server);
		const users = await getUsers(server);
              res.write(`${JSON.stringify({user: users})}\n\n`);
		console.log("FROM GET ROUTE", server, nick);
       });
})

app.get('/onlineUsers', async (req, res) => {
	const onlineUsers = await getUsers('#aboftytest');
	res.send({users: onlineUsers});
});

myEmitter.on('users', (server: string, nick: string) => { 
      console.log("Hello there!");
});

flushUserTable('#aboftytest');
app.listen(4000, () => {console.log('listening on 4000')})
