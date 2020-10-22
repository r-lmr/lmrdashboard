const net = require('net');
const readline = require('readline');
const myEmitter = require('./utils/emitter');

interface IrcMessage {
  prefix?: string;
  command: string;
  params: string[];
}

const parseMessage = (line: string):
    IrcMessage => {
      if (line[0] == ":") {
        let input = line.split(' ');
        let msg = {
          prefix : input[0],
          command : input[1],
          params : input.slice(2)
        };
        return msg;
      } else {
        let input = line.split(' ');
        let msg = {command : input[0], params : [ input[1] ]};
        return msg;
      }
    }

const client =
    net.createConnection({port : 6667, host : "irc.snoonet.org"}, () => {
      console.log('connected to server!');
      client.write("USER tsbottest localhost * :TypeScript Socket Test\r\n");
      client.write("NICK tsbottest\r\n");
    })
const rl = readline.createInterface({input : client, crlfDelay : Infinity});

const names: string[] = [];

rl.on('line', line => {
  // for some reason the chunks arent always parsed as lines by \r\n
  // so we force it by splitting our selves then loop over each line
  line = parseMessage(line);
  if (line.command == 'PING') {
    client.write("PONG " + line.params[0] + "\r\n");
    console.log("PONG " + line.params[0] + "\r\n");
  } else if (line.command == 'MODE') {
    client.write("JOIN #aboftytest\r\n");
    client.write("NAMES #aboftytest\r\n");
    console.log("TRYING TO JOIN #ABOFTYTEST");
  } else if (line.command == 'JOIN') {
    console.log(line);
    const nick = line.prefix.split('!')[0].slice(1);
    myEmitter.emit('join', line.params[0].split(1), nick);
  } else if (line.command == '353') {
    line.params.slice(3).forEach(name => {
      name = name.replace(':', '').trim();
      if (name && !names.includes(name))
        names.push(name);
    });
    console.log(line.params.slice(3));
  } else {
    console.log(line)
    // console.log(data.toString())
  }
})

myEmitter.on(
    'join', (server: string,
             nick: string) => { 
		     console.log(`${nick} has joined ${server}`);
		     if (!names.includes(nick)) names.push(nick);
		     console.log(names);
	     });
client.on('end', () => { console.log('disconnected from server'); })
