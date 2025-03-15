export class ServerStatusAPI {
	/**
	 * Return object of complete details about a game server.
	 * 
	 * @param {number} port 
	 * @returns {Promise<any | null>}
	 */
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

	/**
	 * Return object of complete details about game servers.
	 * 
	 * @param {Array<{ worker:Worker, port: number }>} gameWSServers 
	 * @returns {Promise<Array<{ player: Array<number>, rooms: Array<{ players: Array<{ id: number }> }>, port: number }>>}
	 */
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

	/**
	 * Return object of complete server status.
	 * 
	 * @param {Array<LobbyPlayer>} lobbyPlayers 
	 * @param {Array<LobbyPlayer>} waitList 
	 * @param {Array<{ worker: Worker, port: number }>} gameWSServers 
	 * @returns {Promise<Array<{ online_players: Array<{ id: number, name: string }>, wait_list: Array<{ id: number, name: string }>, game_servers: Array<{ player: Array<number>, rooms: Array<{ players: Array<{ id: number }> }>, port: number }> }>}
	 */
	static async getServerStatus (lobbyPlayers, waitList, gameWSServers) {
		const gameServersStatus = await ServerStatusAPI.getGameServersStatus(gameWSServers);

		return {
			online_players: lobbyPlayers.map(player => {
				return {
					id: player.id,
					name: player.name
				};
			}),
			wait_list: waitList.map(player => {
				return {
					id: player.id,
					name: player.name
				};
			}),
			game_servers: gameServersStatus
		};
	}
}
