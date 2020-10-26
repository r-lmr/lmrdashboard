import dotenv from 'dotenv';
dotenv.config();
import knex from './dbConn';


export async function getLines(server: string, numOfLines: number) {
	const messages = await knex('last_messages').select().where({server}).orderBy('dateCreated','desc').limit(numOfLines);	
	const parsedMsg = messages.map(entry => {
		return { 
			nick: entry["user"], 
			server: entry["server"], 
			message: entry["message"], 
			dateCreated: entry["dateCreated"]
		}
	});
	return parsedMsg;
}

export async function saveLine(nick: string, server: string, message: string) {
	await knex('last_messages').insert({user: nick, server, message});
	console.log('Saving message to db.');
}

export default { getLines };

//getLines('#aboftytest',2);
