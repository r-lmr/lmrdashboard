import EventSource from "eventsource";
const eventSource = new EventSource("http://localhost:4000/test");
console.log("created eventSource");
export default eventSource;
