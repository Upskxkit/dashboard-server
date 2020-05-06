"use strict";

import {IncomingMessage, RequestListener, Server, ServerOptions, ServerResponse} from "http";
import {Application} from "./app";
import wsApiRouter from "./api/ws-api/router"
import * as WebSocket from "ws";
import Socket = NodeJS.Socket;

const http = require('http');
const https = require('https');
const webSocket = require('ws');

interface iTransport {
  createServer(requestListener?: RequestListener): Server;

  createServer(options: ServerOptions, requestListener?: RequestListener): Server;
}

interface iTransports {
  http: iTransport,
  ws: iTransport,
  wss: iTransport,
  https: iTransport
}

interface iConfig {
  port: number;
  host: string;
  transport: keyof iTransports;
  concurrency?: any;
  queue?: any;
}

const TRANSPORT: iTransports = {http, https, ws: http, wss: https};
const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const SHUTDOWN_TIMEOUT = 5000;
const LONG_RESPONSE = 30000;
const METHOD_OFFSET = '/api/'.length;
const clients = new Map<Socket, Client>();
const clientsWS = new Set<WebSocket>();
const closeClients = () => {
  for (const [connection, client] of clients.entries()) {
    clients.delete(connection);
    client.error(503);
    // connection.destroy();
  }

  for (const connection of clientsWS.values()) {
    connection.close(1001, "server down")
  }

};

const listener = (application: Application) => (req: IncomingMessage, res: ServerResponse) => {
  let finished = false;

  /* const {method, url, connection} = req;
   const client = new Client(req, res, application);
   clients.set(connection, client);

   const timer = setTimeout(() => {
       if (finished) return;
       finished = true;
       clients.delete(res.connection);
       client.error(504);
   }, LONG_RESPONSE);

   res.on('close', () => {
       if (finished) return;
       finished = true;
       clearTimeout(timer);
       clients.delete(res.connection);
   });

   application.logger.log(`${method}\t${url}`);

   if (url.startsWith('/api/')) {
       if (method === 'POST') client.api();
       else client.error(403);
   } else {
       client.static();
   }*/
};

/*const apiws = (application: Application, connection: Socket, req: IncomingMessage) => async (message: string) => {
    const {semaphore} = application.server;
    const send = obj => connection.send(JSON.stringify(obj));
    try {
        await semaphore.enter();
    } catch {
        this.error(504);
        return;
    }
    try {
        const ip = req.connection.remoteAddress;
        const {method, args} = JSON.parse(message);
        const session = await application.auth.restore(req);
        if (!session && method !== 'signIn') {
            // application.logger.error(`Forbidden: ${method}`);
            send({result: 'error', reason: 'forbidden'});
            // semaphore.leave();
            return;
        }
        const sandbox = session ? session.sandbox : undefined;
        const context = session ? session.context : {};
        const proc = application.runScript(method, sandbox);
        const result = await proc(context)(args);
        if (method === 'signIn') {
            const session = application.auth.start(req, ip, result.userId);
            result.token = session.cookie;
        }
        send(result);
    } catch (err) {
        // application.logger.error(err.stack);
        send({result: 'error'});
    }
    // semaphore.leave();
};*/

const apiws = (connection: WebSocket, req: IncomingMessage) => {
  clientsWS.add(connection);

  connection.on('message', async (event: string) => {
    console.log(event);
    const {method, args} = JSON.parse(event);
    const response = await wsApiRouter({method, args});

    for (const client of clientsWS.values()) {
      client.send(JSON.stringify(response));
    }

  });

  connection.on('close', (reasonCode, description) => {
    console.log('Disconnected ');
    // console.dir(connection);
    console.dir({reasonCode, description});
    clientsWS.delete(connection);
  });
}

const timeout = (msec: number) => new Promise(resolve => {
  setTimeout(resolve, msec);
});

class Client {
  constructor(private req: IncomingMessage, private res: ServerResponse, private application: Application) {
  }

  api() {
  }

  error(status: number) {
    if (this.res.writableEnded) return;
    this.res.writeHead(status, {'Content-Type': 'text/plain'});
    this.res.end(`HTTP ${status}: ${http.STATUS_CODES[status]}`);
  }
}

export class appServer {
  public instance: Server;
  public ws: WebSocket;

  constructor(private config: iConfig, private application: Application) {
    const {port, transport, concurrency, queue} = this.config;
    const lib = TRANSPORT[transport];

    const handler = listener(application);

    this.instance = lib.createServer({...application}, handler);
    this.instance.listen(port);

    this.ws = new webSocket.Server({server: this.instance});
    this.ws.on('connection', apiws);
  }

  async close() {
    this.instance.close(err => {
      // if (err) this.application.logger.error(err.stack);
    });
    await timeout(SHUTDOWN_TIMEOUT);
    closeClients();
  }
}
