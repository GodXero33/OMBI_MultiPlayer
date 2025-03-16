const playerIds = ['XJ7PQLA29D', 'N8G5TZWMKX', 'Y2V9DXRTQW', 'B4L6MNZPQA', 'K7XPZQW8LM', 'QWLN7X5ZVD', 'ZMP38WLNYX', 'TQXZL9WM28', 'VWPMX8L72Q', 'A9KXQWLMP7', 'MZXQ8WLN5T', 'WPLN9QX7ZM', 'YXQLMP782W', 'PQMZXLW872', 'KLX9QMPWT8', 'ZPQWLX87MT', 'N8XWLQMPZ3', 'XQMPZL9WT7', 'MPXLQWN9T8', 'LQMPZX8WT9', 'PWLXQMN87Z', 'XLMPZQW87T', 'MZPXWQLN78', 'QWZPLMX78T', 'NXQZMPWL87', 'LMPZXWQ89T', 'PQWLXMN98Z', 'MPXLQWN78Z', 'WLXQMPZ87N', 'PXWZQLM87N'];

const port = 8080;
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const url = `${window.location.hostname}:${port}`;
const id = playerIds[Math.floor(Math.random() * playerIds.length)];
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
