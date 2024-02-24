import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketOpCode } from 'obs-websocket-js';
import { sendMessage } from './utils';

const PORT = 1235;

const wss = new WebSocketServer(
  {
    port: PORT,
    handleProtocols(protocols) {
      if (protocols.has('obswebsocket.msgpack')) {
        return 'obswebsocket.msgpack';
      }
      return 'obswebsocket.json';
    },
  },
  () => console.log(`Server is listening on port ${PORT}.`)
);

wss.on('connection', (ws) => {
  console.log('Client connected', ws.protocol);

  // Send Hello message
  sendMessage(
    {
      op: WebSocketOpCode.Hello,
      d: {
        obsWebSocketVersion: '5.0.0',
        rpcVersion: 1,
      },
    },
    ws
  );

  // Broadcast messages to all clients
  ws.on('message', (data, isBinary) => {
    console.log(data.toString());
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
