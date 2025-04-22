const port = window.CONFIG.WS_PORT;
const id = crypto.randomUUID();
const type = 'player';

const socket = new WebSocket(`ws://localhost:${port}?id=${id}&type=${type}`);
const status = document.getElementById('status');

socket.onopen = () => {
	status.textContent = '✅';
	console.log('Connected!');
};

socket.onmessage = e => {
	console.log('Message:', e.data);
};

socket.onclose = () => {
	status.textContent = '❌';
	console.warn('Disconnected');
};
