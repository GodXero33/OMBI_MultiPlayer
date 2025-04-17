const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const cors = require('cors');
const url = require('url');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

(function () { // setup express endpoints
	app.get('/config.js', (_, res) => {
		res.setHeader('Content-Type', 'application/javascript');
		res.send(`window.CONFIG = { WS_PORT: ${PORT} };`);
	});
});

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer });

const CODES = {
	'EXIST_CLIENT_RECONNECT': 3001
};

const lobbyPlayers = [];

wsServer.on('connection', (ws, req) => {
	const { query } = url.parse(req.url, true);

	const id = query.id || 'unknown';
	const type = query.type || 'player';

	lobbyPlayers.push(ws);

	console.log(`Client connected | id: ${id}, type: ${type}`);
	ws.send(JSON.stringify({ type: 'state' }));

	ws.on('message', (message) => {
		try {
			const msg = JSON.parse(message);

			handleClientMessage(ws, msg);
		} catch (err) {
			console.error('Bad message:', message);
		}
	});

	ws.on('close', () => {
		console.log('Client disconnected');

		const index = lobbyPlayers.findIndex(client => client.ws === ws);
		if (index !== -1) lobbyPlayers.splice(index, 1);
	});
});

function broadcast (ws, msg) {
	lobbyPlayers.forEach(player => {
		if (ws.readyState === WebSocket.OPEN) player.send(JSON.stringify(msg));
	});
}

function handleClientMessage (ws, msg) {
	if (msg.type == 'test') {
		broadcast(msg);
	}
}

function sendMessage (ws, msg) {
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(msg));
	}
}

httpServer.listen(PORT, () => {
	console.log(`Http Server & WebSocket Server running on http://localhost:${PORT}`);
});
