import WebSocket, { MessageEvent } from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { parseMessage, sendMessage } from './utils';
import {
  IncomingMessage,
  OBSRequestTypes,
  WebSocketOpCode,
} from 'obs-websocket-js';

class FMSWebSocketClient {
  ws: ReconnectingWebSocket;
  requestHandlers: {
    [key in keyof OBSRequestTypes]?: (
      req?: any | void
    ) => Record<string, unknown> | void;
  } = {};

  constructor(url: string) {
    console.log('FMS WebSocket connection initializing...');
    this.ws = new ReconnectingWebSocket(url, [], { WebSocket });
    this.ws.onopen = this._handleOpen;
    this.ws.onclose = this._handleClose;
    this.ws.onmessage = this._handleMessage.bind(this);
  }

  _handleOpen() {
    console.log('FMS WebSocket connection connected successfully.');
  }

  _handleClose() {
    console.log('FMS WebSocket connection closed. Reconnecting...');
  }

  _handleMessage(event: MessageEvent) {
    try {
      const message = parseMessage(event.data, this.ws?.protocol);
      console.log('FMS WebSocket message received:', message);

      if (message.op === WebSocketOpCode.Identify) {
        return this.reply({
          op: WebSocketOpCode.Identified,
          d: { negotiatedRpcVersion: 1 },
        });
      } else if (message.op === WebSocketOpCode.Reidentify) {
        return this.reply({
          op: WebSocketOpCode.Identified,
          d: { negotiatedRpcVersion: 1 },
        });
      } else if (message.op === WebSocketOpCode.Request) {
        const { requestData, requestId, requestType } = message.d;
        const handler = this.requestHandlers[requestType];
        if (handler) {
          const responseData = handler(requestData);
          return this.reply({
            op: WebSocketOpCode.RequestResponse,
            d: {
              // @ts-expect-error don't care
              requestType,
              requestId,
              requestStatus: {
                result: true,
                code: 100,
              },
              // @ts-expect-error don't care
              responseData,
            },
          });
        } else {
          console.error('Unknown request type:', requestType);
          return this.reply({
            op: WebSocketOpCode.RequestResponse,
            d: {
              // @ts-expect-error don't care
              requestType,
              requestId,
              requestStatus: {
                result: false,
                code: 204,
                comment: 'unknown type',
              },
            },
          });
        }
      }
    } catch (e) {
      console.error('Error handling message:', e);
    }
  }

  reply(message: IncomingMessage) {
    return sendMessage(message, this.ws);
  }
}

export default FMSWebSocketClient;
