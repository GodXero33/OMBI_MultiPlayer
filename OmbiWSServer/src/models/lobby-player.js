export class LobbyPlayer {
	constructor (ws, lobbyPlayerInfo) {
		this.ws = ws;
		this.id = lobbyPlayerInfo.playerId;
		this.name = lobbyPlayerInfo.playerName;
		this.inMatch = false;
	}
}
