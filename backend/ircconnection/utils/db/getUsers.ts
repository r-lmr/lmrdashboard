import * as db from './dbConn';

db('online_users').insert({user: 'aboft', server: '#aboftytest'});
console.log('inserting');
