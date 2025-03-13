
export class GameClient {
	constructor (ws, id) {
		this.ws = ws;
		this.id = id;
		this.room = null;
	}

	setRoom (room) {
		this.room = room;
	}
}
