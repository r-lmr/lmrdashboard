import EventSource from "eventsource";
const eventSource = new EventSource("http://localhost:4000/test");
export default eventSource;
