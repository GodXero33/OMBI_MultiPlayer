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

// Get current server status of the current game server.
apiRouter.get('/server-status', (req, res) => res.json({
	players: clients.map(player => player.id),
	rooms: rooms.map(room => {
		return {
			players: room.clients.map(player => {
				return {
					id: player.id
				};
			})
		};
	}),
	port: PORT
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
		
		const targetClient = clients.find(client => client.ws == ws);

		targetClient.room.close(); // On client close, target room close with all other clients in the room.

		rooms = rooms.filter(room => room.isOpen);
		clients = clients.filter(client => client.ws != ws);
	});
	ws.on('error', (err) => console.error(`WebSocket error: ${err.message}`));
});

parentPort.on('message', (message) => onMessageFromParent(message));

/**
 * 
 * @param {Array<number>} ids 
 */
function makeNewRoom (ids) {
	console.log(`New room: ${ids}`);

	const newRoom = new GameRoom(ids);

	newRoom.testClients(clients);
	rooms.push(newRoom);

	if (!newRoom.isFull()) waitingRooms.push(newRoom);
}

/**
 * When message received from main server.
 * 
 * @param { { type: string, message: string, data: any } } message 
 */
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

/**
 * Send message to main server.
 * 
 * @param { { type: string, message: string, data: any } } message 
 */
function postMessageToParent (message) {
	parentPort.postMessage(JSON.stringify(message));
}

/**
 * When message received from a game server client.
 * 
 * @param {WebSocket} ws 
 * @param { { type: string, message: string, data: any } } message 
 */
function onMessageFromGameServerClient (ws, message) {
	console.log(`Received: ${message}\n\ton port:${PORT}`);
}

/**
 * Send message to client on a gameWSServer.
 * 
 * @param {WebSocket} ws 
 * @param { { type: string, message: string, data: any } } message 
 */
function sendMessageToGameServerClient (ws, message) {
	ws.send(JSON.stringify(message));
}
