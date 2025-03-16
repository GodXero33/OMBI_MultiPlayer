const port = 8080;
const url = `http://localhost:${port}`;
let isLastStatusReceived = true;

function updateStatusInfo(data) {
	document.body.innerHTML = `
		<div class="server-container">
			<h1>Game Server Status</h1>
			
			<div class="section">
				<h2>Online Players</h2>
				<ul id="online-players">
					${data.online_players.length > 0 
						? data.online_players.map(player => `<li>ID: ${player.id}, Name: ${player.name}</li>`).join('')
						: "<li>No players online</li>"}
				</ul>
			</div>
			
			<div class="section">
				<h2>Wait List</h2>
				<ul id="wait-list">
					${data.wait_list.length > 0 
						? data.wait_list.map(player => `<li>${player}</li>`).join('')
						: "<li>Empty</li>"}
				</ul>
			</div>

			<div class="section">
				<h2>Game Servers</h2>
				<div id="game-servers">
					${data.game_servers.map(server => `
						<div class="server-box">
							<p><strong>Port:</strong> ${server.port}</p>
							<p><strong>Players:</strong> ${server.players.length}</p>
							<p><strong>Rooms:</strong> ${server.rooms.length}</p>
							
							${server.players.length > 0 ? `
								<h3>Players in this server:</h3>
								<ul>
									${server.players.map(playerId => {
										const player = data.online_players.find(p => p.id === playerId);
										if (player) {
											return `<li>ID: ${player.id}, Name: ${player.name}</li>`;
										} else {
											return `
												<li style="color: red;">
													Warning: Player with ID ${playerId} has no access!
												</li>`;
										}
									}).join('')}
								</ul>
							` : "<p>No players in this server.</p>"}

							${server.rooms.length > 0 ? `
								<h3>Rooms:</h3>
								<ul>
									${server.rooms.map(room => `
										<li>
											${room.players.map(player => `<span>ID: ${player.id}, Name: ${player.name}</span>`).join(' ')}
										</li>
									`).join('')}
								</ul>
							` : "<p>No rooms available.</p>"}
						</div>
					`).join('')}
				</div>
			</div>
		</div>
		<p>${JSON.stringify(data)}</p>
	`;
}

async function loadServerDetails() {
	try {
		const response = await fetch(`${url}/server-status`);

		if (!response.ok) throw new Error('Failed to fetch server status.');

		const data = await response.json();
		isLastStatusReceived = true;

		updateStatusInfo(data);
	} catch (error) {
		document.body.innerHTML = '<h1>Error: Server not found.</h1>';
		isLastStatusReceived = true;
	}
}

setInterval(() => {
	if (!isLastStatusReceived) return;

	isLastStatusReceived = false;

	loadServerDetails();
}, 1000);
