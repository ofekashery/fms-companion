import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { IncomingMessage, OutgoingMessage } from 'obs-websocket-js';
import { decode, encode } from '@msgpack/msgpack';

export const sendMessage = (
  message: IncomingMessage,
  socket: WebSocket | ReconnectingWebSocket
) => {
  if (socket.protocol === 'obswebsocket.msgpack') {
    socket.send(encode(message));
    return;
  } else {
    socket.send(JSON.stringify(message));
  }
};

export const parseMessage = (data: WebSocket.Data, protocol: string) => {
  if (protocol === 'obswebsocket.msgpack') {
    return decode(data) as OutgoingMessage;
  } else {
    return JSON.parse(data.toString()) as OutgoingMessage;
  }
};
