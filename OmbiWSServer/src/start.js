const express = require('express');
const http = require('http');
const net = require('net');
const { Worker } = require('worker_threads');
const WebSocket = require('ws');
const cors = require('cors');
const { LobbyClient } = require('./models/client.lobby');

const apiRouter = express();
const httpServer = http.createServer(apiRouter);
const lobbyWSServer  = new WebSocket.Server({ server: httpServer });

const PORT = 8080;
let lobbyClients = [];
let waitList = [];
let gameWSServers = [];

apiRouter.use(cors());
apiRouter.use(express.json());

// Add client to wait list.
apiRouter.post('/wait-list', (req, res) => {
	const clientId = req.body.id;
	const targetClient = lobbyClients.find(client => client.id == clientId);

	// If target client is undefined or target client is a match, can't add to wait list.
	if (!targetClient || targetClient.inMatch) return res.json({ ok: false });

	if (!waitList.includes(targetClient)) {
		waitList.push(targetClient);
		checkWaitList();
	}

	console.log(waitList.length);
	return res.json({ ok: true });
});

httpServer.listen(PORT, () => {
	console.log(`API list server running on http://127.0.0.1:${PORT}`);
});

lobbyWSServer.on('connection', (ws, req) => {
	const clientId = req.url.split('/').pop();
	const clientIdAvailability = getLobbyClientIDAvailability(clientId);

	if (clientIdAvailability == 1) {
		sendMessageToLobbyClient(ws, { type: 'error', message: 'User already logged in.' });
		ws.close();
		return;
	}

	if (clientIdAvailability == 2) {
		sendMessageToLobbyClient(ws, { type: 'error', message: 'Not a user.' });
		ws.close();
		return;
	}

	console.log(`Client connected with ID: ${clientId}`);

	lobbyClients.push(new LobbyClient(ws, clientId));

	ws.on('message', (msg) => onMessageFromClient(ws, msg));
	ws.on('close', () => onClientClose(ws));
	ws.on('error', (err) => console.error(`WebSocket error: ${err.message}`));
});

// Check if wait list has at least four clients. If it is all clients push to available game server and empty wait list.
function checkWaitList () {
	if (waitList.length != 2) return;

	const { worker, port } = getAvailableGameServer();
	
	postMessageToGameWSServer(worker, { type: 'new-room', ids: waitList.map(client => client.id) });

	waitList.forEach(client => {
		sendMessageToLobbyClient(client.ws, { type: 'game-server-port', port });
	});

	waitList.length = 0;
}

// Get currently available game server.
function getAvailableGameServer () {
	return gameWSServers[0];
}

// Check if the client id is available in the database.
function isClientIdIsAvailablePlayerId (clientId) {
	return true;
}

/**
 * 
 * @param {number} clientId - ID of the client that need to test.
 * @returns 1 if client already in the lobby, 2 if client is not a player signed up into system, 3 can connect to lobby server.
 */
function getLobbyClientIDAvailability (clientId) {
	const targetClient = lobbyClients.find(client => client.id == clientId);

	if (targetClient) return 1;

	return isClientIdIsAvailablePlayerId(clientId) ? 3 : 2;
}

// When clients id received, check client in the clients array and if found assign id to client.
function assignIdToLobbyClient (id) {
	const targetClient = lobbyClients.find(client => client.id == id);

	if (!targetClient) return false;

	targetClient.id = id;
	return true;
}

// When client disconnected from lobby server.
function onClientClose (ws) {
	console.log('Client disconnected');

	lobbyClients = lobbyClients.filter(client => client.ws != ws);
	waitList = waitList.filter(client => client.ws != ws);
}

// Handle all incoming messages from lobby clients.
function onMessageFromClient (ws, msg) {
	const msgData = JSON.parse(msg);

	console.log(msgData);

	/* if (msgData.type === 'join-lobby') { // When client needs to join the lobby.
		sendMessageToLobbyClient(ws, { type: 'join-lobby', status: assignIdToLobbyClient(ws, msgData.id) });
		return;
	} */
}

// Send messages to lobby clients.
function sendMessageToLobbyClient (ws, message) {
	ws.send(JSON.stringify(message));
}

// Check availability of a port.
function checkPort (port) {
	return new Promise((resolve) => {
		const socket = net.connect(port, '127.0.0.1');

		socket.once('connect', () => {
			socket.destroy();
			resolve(false);
		});

		socket.once('error', (err) => {
			if (err.code === 'ECONNREFUSED') {
				resolve(port);
			} else {
				resolve(false);
			}
		});

		socket.setTimeout(200);

		socket.once('timeout', () => {
			socket.destroy();
			resolve(false);
		});
	});
}

// Get all available ports up to specific range(100) starting from main port(8081 - 8181).
async function getAvailablePorts (range = 100) {
	const checks = [];
	const start = PORT + 1;
	const end = PORT + range + 1;

	for (let port = start; port <= end; port++) checks.push(checkPort(port));

	const results = await Promise.all(checks);

	return results.filter(Boolean);
}

// Send message to game a game server.
function postMessageToGameWSServer (worker, message) {
	worker.postMessage(JSON.stringify(message));
}

// Start new game server on new worker.
async function startGameWSServer () {
	const availablePorts = await getAvailablePorts();

	if (availablePorts.length === 0) { // If no available ports found kill the main thread.
		console.error('No available ports found');
		stopAllGameWSServers(); // terminate all the process if no available port has found.
		return;
	}

	const port = availablePorts[Math.floor(Math.random() * availablePorts.length)];
	console.log(`Starting game server on port ${port}`);

	const gameWSServer = new Worker('./src/server/game-server.js', { workerData: port });
	const serverInfo = { worker: gameWSServer, port };

	gameWSServers.push(serverInfo);

	postMessageToGameWSServer(gameWSServer, { type: 'start' });

	gameWSServer.on('message', (msg) => {
		console.log(`From worker: ${JSON.parse(msg).message}`);
	});

	gameWSServer.on('exit', () => {
		console.log(`Game server on port ${port} stopped`);
		const index = gameWSServers.findIndex(server => server.worker === gameWSServer);

		if (index !== -1) gameWSServers.splice(index, 1);
	});
}

// Start two game servers when this thread start.
async function startGameWSServers () {
	const count = 2;

	for (let i = 0; i < count; i++) await startGameWSServer();
}

// Close all game servers when main(this) server is killed.
function stopAllGameWSServers () {
	console.log('Shutting down all game servers...');

	gameWSServers.forEach(({ worker, port }) => {
		console.log(`Terminating game server on port ${port}`);
		postMessageToGameWSServer(worker, { type: 'shutdown' });
		worker.terminate();
	});

	process.exit();
}

// Stop all servers when the main(this) server is killed.
process.on('SIGINT', stopAllGameWSServers); // When press Ctrl.
process.on('SIGTERM', stopAllGameWSServers); // When the system stops the program.

startGameWSServers();

// setInterval(() => {
// 	gameWSServers.forEach(serverInfo => {
// 		const port = serverInfo.port;

// 		fetch(`http://localhost:${port}/clients`, { method: 'GET' }).then(res => {
// 			if (!res.ok) throw new Error(`Failed to fetch clients details for port ${port}`);

// 			return res.json();
// 		}).then(data => {
// 			console.warn(data);
// 		}).catch(error => {
// 			console.error(error);
// 		});
// 	});
// }, 2000);
