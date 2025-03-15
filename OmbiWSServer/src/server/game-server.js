const express = require('express');
const cors = require('cors');
const http = require('http');
const { workerData, parentPort } = require('worker_threads');
const WebSocket = require('ws');
const { GamePlayer } = require('../models/game-player');
const { GameRoom } = require('../models/game-room');

const apiRouter = express();
const httpServer = http.createServer(apiRouter);
const gameWSServer  = new WebSocket.Server({ server: httpServer });

const PORT = workerData;
let players = [];
let rooms = [];
let waitingRooms = [];

apiRouter.use(cors());
apiRouter.use(express.json());

// Get current server status of the current game server.
apiRouter.get('/server-status', (req, res) => res.json({
	players: players.map(player => player.id),
	rooms: rooms.map(room => {
		return {
			players: room.players.map(player => {
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
	const playerId = req.url.split('/').pop();

	const currentClient = players.find(player => player.id == playerId);

	if (currentClient) { // If player already in list no need to add again.
		sendMessageToGameServerPlayer(ws, { type: 'error', message: 'Already in.' });
		ws.close();
		return;
	}

	console.log(`Player connected with ID: ${playerId} to game server: ${PORT}`);

	const newPlayer = new GamePlayer(ws, playerId);
	waitingRooms = waitingRooms.filter(room => !room.isFull());

	players.push(newPlayer);
	waitingRooms.forEach(room => room.testPlayer(newPlayer));

	ws.on('message', (message) => onMessageFromGameServerPlayer(ws, message));
	ws.on('close', () => {
		console.log('Player disconnected');
		
		const targetPlayer = clients.find(client => client.ws == ws);

		targetPlayer.room.close(); // On player close, target room close with all other players in the room.

		rooms = rooms.filter(room => room.isOpen);
		players = players.filter(client => client.ws != ws);
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

	newRoom.testPlayers(players);
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
function onMessageFromGameServerPlayer (ws, message) {
	console.log(`Received: ${message}\n\ton port:${PORT}`);
}

/**
 * Send message to player on a gameWSServer.
 * 
 * @param {WebSocket} ws 
 * @param { { type: string, message: string, data: any } } message 
 */
function sendMessageToGameServerPlayer (ws, message) {
	ws.send(JSON.stringify(message));
}
