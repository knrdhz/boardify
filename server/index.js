const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const port = 8088;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

// Web socket server
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

server.listen(port, function () {
    console.log(`Web Sockets Server is listening on ${port}!`);
});
