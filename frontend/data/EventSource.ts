import EventSource from "eventsource";
const eventSource = new EventSource(
  process.env.LMR_EVENT_SOURCE || "http://localhost:4000/test"
);
console.log("created eventSource");
export default eventSource;
