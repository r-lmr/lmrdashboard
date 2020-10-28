import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000'); function subscribeToTimer(cb: (timestamp: Date) => void) {
    socket.on('timer', (timestamp: Date) => cb(timestamp));
    socket.emit('subscribeToTimer', 5000);
}

export { subscribeToTimer };