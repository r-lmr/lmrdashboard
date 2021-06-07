import EventSource from 'eventsource';
const eventSource = new EventSource(process.env.NEXT_PUBLIC_LMRD_EVENT_SOURCE || 'http://localhost:4000/test');
const baseUrl = eventSource.url.slice(0, eventSource.url.lastIndexOf('/'));
const getEventSourceBaseUrl = (): string => baseUrl;

export default eventSource;
export { getEventSourceBaseUrl };
