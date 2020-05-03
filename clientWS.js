const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  const data = {method: "request:create", args: {title: "test", status: "check"}};
  ws.send(JSON.stringify(data));
  setTimeout(() => {
    ws.send(JSON.stringify({method: "request:list"}))
  }, 1000);
});

ws.on('message', function incoming(data) {
  console.log(data.toString());
});

ws.on("pong", event => {
  console.log(event.toString());
})

setInterval(ws.emit, 1000, "ping")
