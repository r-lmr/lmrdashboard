import knex from './dbConn';

export async function getUsers(server: string) {
	const allUsersDB = await knex('online_users').select('user').where({server});	
	const allUsers = allUsersDB.map(user => user["user"]);
	console.log(allUsers);
	return allUsers;
}

export async function deleteUser(nick: string, server: string) {
	await knex('online_users').del().where({user: nick, server});
	const user = await knex('online_users').select('user').where({user: nick, server: server});
	console.log(user)
	console.log(`User ${nick} has parted.`);
};

export async function addUser(nick: string, server: string) {
	await knex('online_users').insert({user: nick, server});
	console.log(`${nick} has come online.`);
};

//getUsers('aboftytest');
//deleteUser('aboft','aboftytest');
//addUser('fuckboi','#aboftytest');
//getUsers('#aboftytest');

export default { getUsers, deleteUser, addUser };
