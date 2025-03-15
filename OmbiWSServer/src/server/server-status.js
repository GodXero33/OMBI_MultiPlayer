export class ServerStatusAPI {
	// Return object of complete details about a game server.
	static async getGameServerStatus (port) {
		try {
			const res = await fetch(`http://localhost:${port}/server-status`);

			if (!res.ok) throw new Error(`Failed to fetch server status on server ${port}`);

			return await res.json();
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	// Return object of complete details about game servers.
	static async getGameServersStatus (gameWSServers) {
		const gameServersDetails = [];

		for (let a = 0; a < gameWSServers.length; a++) {
			const currentServerStatus = await ServerStatusAPI.getGameServerStatus(gameWSServers[a].port);
			gameServersDetails.push(currentServerStatus ? currentServerStatus : {
				player: [],
				rooms: [],
				port: gameWSServers[a].port
			});
		}

		return gameServersDetails;
	}

	// Return object of complete server status.
	static async getServerStatus (lobbyPlayers, waitList, gameWSServers) {
		const gameServersStatus = await ServerStatusAPI.getGameServersStatus(gameWSServers);

		return {
			online_players: lobbyPlayers.map(player => player.id),
			wait_list: waitList.map(player => player.id),
			game_servers: gameServersStatus
		};
	}
}
