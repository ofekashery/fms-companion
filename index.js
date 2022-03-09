const WebSocket = require("ws");

const wss = new WebSocket.WebSocketServer({
  port: 3323,
});

wss.on("connection", (ws) => {
  ws.on("message", (data, isBinary) => {
    console.log(data);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
