const express = require('express');
const cors = require('cors');
const http = require('http');
const { workerData, parentPort } = require('worker_threads');
const WebSocket = require('ws');
const { GameClient } = require('../models/client.game');
const { GameRoom } = require('../models/game.room');

const apiRouter = express();
const httpServer = http.createServer(apiRouter);
const gameWSServer  = new WebSocket.Server({ server: httpServer });

const PORT = workerData;
let clients = [];
let rooms = [];
let waitingRooms = [];

apiRouter.use(cors());
apiRouter.use(express.json());

// Get clients details on current game server.
apiRouter.get('/clients', (req, res) => res.json({
	count: clients.length
}));

httpServer.listen(PORT, () => {
	console.log(`Game Server API list server running on http://localhost:${PORT}`);
	console.log(`WebSocket server started on ws://localhost:${PORT}`);
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);

gameWSServer.on('connection', (ws, req) => {
	const clientId = req.url.split('/').pop();

	const currentClient = clients.find(client => client.id == clientId);

	if (currentClient) { // If client already in list no need to add again.
		sendMessageToGameServerClient(ws, { type: 'error', message: 'Already in.' });
		ws.close();
		return;
	}

	console.log(`Client connected with ID: ${clientId} to game server: ${PORT}`);

	const newClient = new GameClient(ws, clientId);
	waitingRooms = waitingRooms.filter(room => !room.isFull());

	clients.push(newClient);
	waitingRooms.forEach(room => room.testClient(newClient));

	ws.on('message', (message) => onMessageFromGameServerClient(ws, message));
	ws.on('close', () => {
		console.log('Client disconnected');

		clients = clients.filter(client => client.ws != ws);
	});
	ws.on('error', (err) => console.error(`WebSocket error: ${err.message}`));
});

parentPort.on('message', (message) => onMessageFromParent(message));

// When message received from main server.
function onMessageFromParent (message) {
	const messageData = JSON.parse(message);

	if (messageData.type === 'shutdown') {
		server.close(() => process.exit());
		return;
	}

	if (messageData.type === 'start') {
		console.log(`WebSocket server starting on port ${PORT}`);
		return;
	}

	if (messageData.type === 'new-room') {
		makeNewRoom(messageData.ids);
	}
}

function makeNewRoom (ids) {
	console.log(`New room: ${ids}`);

	const newRoom = new GameRoom(ids);

	newRoom.testClients(clients);
	rooms.push(newRoom);

	if (!newRoom.isFull()) waitingRooms.push(newRoom);
}

// Send message to main server.
function postMessageToParent (message) {
	parentPort.postMessage(JSON.stringify(message));
}

// When message received from a game server client.
function onMessageFromGameServerClient (ws, message) {
	console.log(`Received: ${message}\n\ton port:${PORT}`);
}

// Send message to client on a gameWSServer.
function sendMessageToGameServerClient (client, message) {
	client.send(JSON.stringify(message));
}

setInterval(() => {
	rooms.forEach(room => room.log());
}, 1000);
