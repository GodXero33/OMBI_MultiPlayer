export class LobbyClient {
	constructor (ws, id) {
		this.ws = ws;
		this.id = id;
		this.inMatch = false;
	}
}
