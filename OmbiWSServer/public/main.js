const port = 8080;
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const url = `${window.location.hostname}:${port}`;
const id = Math.floor(Math.random() * 10e5);
const socket = new WebSocket(`${protocol}://${url}/${id}`);
let gameSocket = null;

socket.onopen = () => {
	statusDisplay.textContent = 'Connected to WebSocket server';
	console.log('Connected');
}

socket.onmessage = (event) => {
	const data = JSON.parse(event.data);
	console.log('Message from server:', data);

	if (data.type === 'game-server-port') {
		connectToGameServer(data.port);
	}
}

socket.onclose = () => {
	statusDisplay.textContent = 'Disconnected';
	console.log('Disconnected');
}

socket.onerror = (error) => {
	console.error('WebSocket error:', error);
}

function sendMessageToWSServer (message) {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(message));
	}
}

function addToWaitList () {
	fetch(`http://${url}/wait-list`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id })
	}).then(res => {
		if (!res.ok) throw new Error('Failed to fetch');

		return res.json();
	}).then(data => {
		if (data.ok) {
			statusDisplay.textContent = 'Waiting';
		} else {
			statusDisplay.textContent = 'Try again';
		}
	}).catch(error => {
		console.error(error);
	});
}

function connectToGameServer (port) {
	gameSocket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/${id}`);

	gameSocket.onopen = () => {
		console.log('Connected to game server');
	}

	gameSocket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		console.log('Message from game server:', data);
	}

	gameSocket.onclose = () => {
		console.log('Game Server Disconnected');
	}

	gameSocket.onerror = (error) => {
		console.error('Game server error:', error);
	}
}
