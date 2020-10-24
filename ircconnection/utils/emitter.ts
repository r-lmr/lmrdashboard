import {EventEmitter} from 'events';

class MyEmitter extends EventEmitter {};
export const myEmitter = new MyEmitter();