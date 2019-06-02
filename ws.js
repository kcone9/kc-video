const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5060 });
console.log("测试服务器已开启")
// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log(data)
		ws.send(data)
        client.send(data);
      }
    });
  });
});



