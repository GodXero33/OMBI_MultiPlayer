const port = 8080;
const url = `${window.location.protocol}//${window.location.hostname}:${port}`;
let isLastStatusReceived = true;

function updateStatusInfo (data) {
	const { gameWSServers, lobbyClients, waitList } = data;

	const htmlContent = `
		<div>
			<h2>Server Status</h2>
			<p><strong>Game WebSocket Servers:</strong> ${gameWSServers.length}</p>
			<ul>
				${gameWSServers.map(server => `<li>Server port: ${server.port}</li>`).join('')}
			</ul>
			<p><strong>Lobby Clients:</strong> ${lobbyClients.length}</p>
			<ul>
				${lobbyClients.length === 0 ? '<li>No clients in lobby</li>' : lobbyClients.map(client => `<li>Client ID: ${client.id}</li>`).join('')}
			</ul>
			<p><strong>Waitlist:</strong> ${waitList.length}</p>
			<ul>
				${waitList.length === 0 ? '<li>No clients on waitlist</li>' : waitList.map(wait => `<li>Player ID: ${wait.id}</li>`).join('')}
			</ul>
		</div>
	`;

	document.body.innerHTML = htmlContent
}

async function loadServerDetails () {
	try {
		const response = await fetch(`${url}/server-status`);

		if (!response.ok) throw new Error('Failed to fetch server status.');

		const data = await response.json();
		isLastStatusReceived = true;

		updateStatusInfo(data);
	} catch (error) {
		console.error(error);

		document.body.innerHTML = '<h1>Error: Server not found.</h1>';
		isLastStatusReceived = true;
	}
}

setInterval(() => {
	if (!isLastStatusReceived) return;

	isLastStatusReceived = false;

	loadServerDetails();
}, 1000);
