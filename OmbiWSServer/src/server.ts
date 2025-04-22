import WebSocket from 'ws';
import express from 'express';
import http from 'http';
import cors from 'cors';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(cors());

(function () { // setup express endpoints
	app.get('/config.js', (_, res) => {
		res.setHeader('Content-Type', 'application/javascript');
		res.send(`window.CONFIG = { WS_PORT: ${PORT} };`);
	});
})();

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server: httpServer });

const CODES = {
	'EXIST_CLIENT_RECONNECT': 3001
};

const lobbyPlayers = new Array<WebSocket>();

wsServer.on('connection', (ws: WebSocket, req: http.IncomingMessage): void => {
	const { query } = url.parse(req.url ?? '', true);

	if (Number.isInteger(query.id)) return;

	const id = Number.parseInt(query.id as string);
	const type = query.type as string;

	lobbyPlayers.push(ws);

	console.log(`Client connected | id: ${id}, type: ${type}`);
	ws.send(JSON.stringify({ type: 'state' }));

	ws.on('message', (message: any): void => {
		try {
			handleClientMessage(ws, JSON.parse(message));
		} catch (err) {
			console.error('Bad message:', message);
		}
	});

	ws.on('close', (): void => {
		console.log('Client disconnected');

		const index = lobbyPlayers.findIndex((wsCheck): boolean => wsCheck === ws);
		if (index !== -1) lobbyPlayers.splice(index, 1);
	});
});

function broadcast (ws: WebSocket, msg: any): void {
	lobbyPlayers.forEach((player): void => {
		if (ws.readyState === WebSocket.OPEN) player.send(JSON.stringify(msg));
	});
}

function handleClientMessage (ws: WebSocket, msg: any): void {
	if (msg.type === 'test') broadcast(ws, msg);
}

function sendMessage (ws: WebSocket, msg: any): void {
	if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

httpServer.listen(PORT, (): void => console.log(`Http Server & WebSocket Server running on http://localhost:${PORT}`));
