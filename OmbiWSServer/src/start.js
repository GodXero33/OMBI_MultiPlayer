const express = require('express');
const http = require('http');
const net = require('net');
const { Worker } = require('worker_threads');
const WebSocket = require('ws');
const cors = require('cors');
const { LobbyClient } = require('./models/client.lobby');
const { ServerStatusAPI } = require('./server/server-status');

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

	return res.json({ ok: true });
});

apiRouter.get('/server-status', async (req, res) => {
	const serverStatus = await ServerStatusAPI.getServerStatus(lobbyClients, waitList, gameWSServers);
	res.json(serverStatus);
});

httpServer.listen(PORT, () => {
	console.log(`API list server running on http://127.0.0.1:${PORT}`);
});

lobbyWSServer.on('connection', async (ws, req) => {
	const clientId = req.url.split('/').pop();

	ws.on('message', (msg) => onMessageFromClient(ws, msg));
	ws.on('close', () => onClientClose(ws));
	ws.on('error', (err) => console.error(`WebSocket error: ${err.message}`));

	console.log(`Client connected with ID: ${clientId}`);

	const lobbyPlayerInfo = await getLobbyPlayerInfo(clientId);

	if (lobbyPlayerInfo instanceof LobbyClient) {
		sendMessageToLobbyClient(ws, { type: 'error', message: 'User already logged in.' });
		ws.close();
		return;
	}

	if (lobbyPlayerInfo == null) {
		sendMessageToLobbyClient(ws, { type: 'error', message: 'Not a user.' });
		ws.close();
		return;
	}

	lobbyClients.push(new LobbyClient(ws, lobbyPlayerInfo));
});

/**
 * Check if wait list has at least four clients. If it is all clients push to available game server and empty wait list.
 */
function checkWaitList () {
	if (waitList.length != 2) return;

	const { worker, port } = getAvailableGameServer();
	
	postMessageToGameWSServer(worker, { type: 'new-room', ids: waitList.map(client => client.id) });

	waitList.forEach(client => {
		sendMessageToLobbyClient(client.ws, { type: 'game-server-port', port });
	});

	waitList.length = 0;
}

/**
 * Get currently available game server.
 * 
 * @returns { { worker: Worker, port: number } }
 */
function getAvailableGameServer () {
	return gameWSServers[0];
}

/**
 * Get player details from the database.
 * 
 * @param {number} clientId 
 * @returns {Promise<{ id: number, playerId: string, playerName: string, password: string, gmail: string }>}
 */
function getPlayerDetailsByPlayerId (clientId) {
	return new Promise((res, req) => {
		fetch(`http://127.0.0.1:5501/player/get/${clientId}`).then(response => {
			if (!response.ok) throw new Error('Failed to fetch player data.');

			return response.json();
		}).then(data => {
			res(data);
		}).catch(error => {
			rej(error);
		});
	});
}

/**
 * @param {number} clientId - ID of the player that need to test.
 * @returns {Promise<LobbyClient | { id: number, playerId: string, playerName: string, password: string, gmail: string } | null>}
 */
async function getLobbyPlayerInfo (clientId) {
	const targetClient = lobbyClients.find(client => client.id == clientId);

	if (targetClient) return targetClient;

	try {
		const response = await getPlayerDetailsByPlayerId(clientId);
		return response.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * When client disconnected from lobby server.
 * 
 * @param {WebSocket} ws 
 */
function onClientClose (ws) {
	console.log('Client disconnected');

	lobbyClients = lobbyClients.filter(client => client.ws != ws);
	waitList = waitList.filter(client => client.ws != ws);
}

/**
 * Handle all incoming messages from lobby clients.
 * 
 * @param {WebSocket} ws 
 * @param {*} msg 
 */
function onMessageFromClient (ws, msg) {
	const msgData = JSON.parse(msg);

	console.log(msgData);
}

/**
 * Send messages to lobby clients.
 * 
 * @param {WebSocket} ws 
 * @param {*} message 
 */
function sendMessageToLobbyClient (ws, message) {
	ws.send(JSON.stringify(message));
}

/**
 * Check availability of a port.
 * 
 * @param {number} port 
 * @returns {Promise<number>}
 */
function checkPort (port) {
	return new Promise((resolve) => {
		const socket = net.connect(port, '127.0.0.1');

		socket.once('connect', () => {
			socket.destroy();
			resolve(0);
		});

		socket.once('error', (err) => {
			if (err.code === 'ECONNREFUSED') {
				resolve(port);
			} else {
				resolve(0);
			}
		});

		socket.setTimeout(200);

		socket.once('timeout', () => {
			socket.destroy();
			resolve(0);
		});
	});
}

/**
 * Get all available ports up to specific range(100) starting from main port(8081 - 8181).
 * 
 * @param {number} range 
 * @returns {Promise<Array<number>>}
 */
async function getAvailablePorts (range = 100) {
	const checks = [];
	const start = PORT + 1;
	const end = PORT + range + 1;

	for (let port = start; port <= end; port++) checks.push(checkPort(port));

	const results = await Promise.all(checks);

	return results.filter(Boolean);
}

/**
 * Send message to game a game server.
 * 
 * @param {Worker} worker 
 * @param {*} message 
 */
function postMessageToGameWSServer (worker, message) {
	worker.postMessage(JSON.stringify(message));
}

/**
 * Start new game server on new worker.
 */
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

/**
 * Start two game servers when this thread start.
 */
async function startGameWSServers () {
	const count = 2;

	for (let i = 0; i < count; i++) await startGameWSServer();
}

/**
 * Close all game servers when main(this) server is killed.
 */
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
