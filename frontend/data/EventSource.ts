import EventSource from 'eventsource';
const eventSource = new EventSource(process.env.NEXT_PUBLIC_LMRD_EVENT_SOURCE || 'http://localhost:4000/test');
export default eventSource;
