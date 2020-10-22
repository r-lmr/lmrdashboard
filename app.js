var net = require('net');
var readline = require('readline');
var parseMessage = function (line) {
    if (line[0] == ":") {
        var input = line.split(' ');
        var msg = {
            prefix: input[0],
            command: input[1],
            params: input.slice(2)
        };
        return msg;
    }
    else {
        var input = line.split(' ');
        var msg = { command: input[0], params: [input[1]] };
        return msg;
    }
};
var client = net.createConnection({ port: 6667, host: "irc.snoonet.org" }, function () {
    console.log('connected to server!');
    client.write("USER tsbottest localhost * :TypeScript Socket Test\r\n");
    client.write("NICK tsbottest\r\n");
});
var rl = readline.createInterface({ input: client, crlfDelay: Infinity });
rl.on('line', function (line) {
    // for some reason the chunks arent always parsed as lines by \r\n
    // so we force it by splitting our selves then loop over each line
    line = parseMessage(line);
    if (line.command == 'PING') {
        client.write("PONG " + line.params[0] + "\r\n");
        console.log("PONG " + line.params[0] + "\r\n");
    }
    else if (line.command == 'MODE') {
        client.write("JOIN #aboftytest\r\n");
        console.log("TRYING TO JOIN #ABOFTYTEST");
    }
    else {
        console.log(line);
        // console.log(data.toString())
    }
});
client.on('end', function () { console.log('disconnected from server'); });
