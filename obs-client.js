const WebSocket = require("ws");

const fmsServer = new WebSocket("ws://64.227.44.99:3323");
const obs = new WebSocket("ws://localhost:4444");

fmsServer.on("open", () => {
  console.log("FMS Server connected");
});

fmsServer.on("message", (data) => {
  console.log(data.toString());
  obs.send(data.toString());
});

fmsServer.on("close", () => {
  console.log("FMS server closed");
});

obs.on("open", () => {
  console.log("OBS connected");
});

obs.on("message", (data) => {
  fmsServer.send(data.toString());
});

obs.on("close", () => {
  console.log("OBS server closed");
});
