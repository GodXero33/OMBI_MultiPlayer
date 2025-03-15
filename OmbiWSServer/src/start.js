const express = require('express');
const http = require('http');
const net = require('net');
const { Worker } = require('worker_threads');
const WebSocket = require('ws');
const cors = require('cors');
const { LobbyPlayer } = require('./models/lobby-player');
const { ServerStatusAPI } = require('./server/server-status');

const apiRouter = express();
const httpServer = http.createServer(apiRouter);
const lobbyWSServer  = new WebSocket.Server({ server: httpServer });

const PORT = 8080;
let lobbyPlayers = [];
let waitList = [];
let gameWSServers = [];

apiRouter.use(cors());
apiRouter.use(express.json());

// Add player to wait list.
apiRouter.post('/wait-list', (req, res) => {
	const playerId = req.body.id;
	const targetPlayer = lobbyPlayers.find(player => player.id == playerId);

	// If target player is undefined or target player is a match, can't add to wait list.
	if (!targetPlayer || targetPlayer.inMatch) return res.json({ ok: false });

	if (!waitList.includes(targetPlayer)) {
		waitList.push(targetPlayer);
		checkWaitList();
	}

	return res.json({ ok: true });
});

apiRouter.get('/server-status', async (req, res) => {
	const serverStatus = await ServerStatusAPI.getServerStatus(lobbyPlayers, waitList, gameWSServers);
	res.json(serverStatus);
});

httpServer.listen(PORT, () => {
	console.log(`API list server running on http://127.0.0.1:${PORT}`);
});

lobbyWSServer.on('connection', async (ws, req) => {
	const playerId = req.url.split('/').pop();

	ws.on('message', (msg) => onMessageFromPlayer(ws, msg));
	ws.on('close', () => onPlayerClose(ws));
	ws.on('error', (err) => console.error(`WebSocket error: ${err.message}`));

	console.log(`Player connected with ID: ${playerId}`);

	const lobbyPlayerInfo = await getLobbyPlayerInfo(playerId);

	if (lobbyPlayerInfo instanceof LobbyPlayer) {
		sendMessageToLobbyPlayer(ws, { type: 'error', message: 'User already logged in.' });
		ws.close();
		return;
	}

	if (lobbyPlayerInfo == null) {
		sendMessageToLobbyPlayer(ws, { type: 'error', message: 'Not a user.' });
		ws.close();
		return;
	}

	lobbyPlayers.push(new LobbyPlayer(ws, lobbyPlayerInfo));
});

/**
 * Check if wait list has at least four players. If it is all players push to available game server and empty wait list.
 */
function checkWaitList () {
	if (waitList.length != 2) return;

	const { worker, port } = getAvailableGameServer();
	
	postMessageToGameWSServer(worker, { type: 'new-room', ids: waitList.map(player => player.id) });

	waitList.forEach(player => {
		sendMessageToLobbyPlayer(player.ws, { type: 'game-server-port', port });
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
 * @param {number} playerId 
 * @returns {Promise<{ id: number, playerId: string, playerName: string, password: string, gmail: string }>}
 */
function getPlayerDetailsByPlayerId (playerId) {
	return new Promise((res, req) => {
		fetch(`http://127.0.0.1:5501/player/get/${playerId}`).then(response => {
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
 * @param {number} playerId - ID of the player that need to test.
 * @returns {Promise<LobbyClient | { id: number, playerId: string, playerName: string, password: string, gmail: string } | null>}
 */
async function getLobbyPlayerInfo (playerId) {
	const targetPlayer = lobbyPlayers.find(player => player.id == playerId);

	if (targetPlayer) return targetPlayer;

	try {
		const response = await getPlayerDetailsByPlayerId(playerId);
		return response.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * When player disconnected from lobby server.
 * 
 * @param {WebSocket} ws 
 */
function onPlayerClose (ws) {
	console.log('Player disconnected');

	lobbyPlayers = lobbyPlayers.filter(player => player.ws != ws);
	waitList = waitList.filter(player => player.ws != ws);
}

/**
 * Handle all incoming messages from lobby players.
 * 
 * @param {WebSocket} ws 
 * @param {*} msg 
 */
function onMessageFromPlayer (ws, msg) {
	const msgData = JSON.parse(msg);

	console.log(msgData);
}

/**
 * Send messages to lobby players.
 * 
 * @param {WebSocket} ws 
 * @param {*} message 
 */
function sendMessageToLobbyPlayer (ws, message) {
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
