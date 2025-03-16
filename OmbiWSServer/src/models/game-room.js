export class GameRoom {
	constructor (ids) {
		this.waitingIds = ids;
		this.players = [];
		this.isOpen = true;
	}

	addClient (player) {
		this.players.push(player);
		player.setRoom(this);
		this.waitingIds.splice(this.waitingIds.indexOf(player.id), 1);
	}

	testPlayer (player) {
		const matchingId = this.waitingIds.find(id => id == player.id);
	
		if (matchingId) {
			this.addClient(player);
		}
	}

	testPlayers (players) {
		if (this.isFull()) return;

		players.forEach(player => this.testPlayer(player));
	}

	isFull () {
		return this.players.length == 2;
	}

	close () {
		if (!this.isOpen) return;

		this.isOpen = false;

		this.players.forEach(client => {
			const ws = client.ws;

			if (ws && ws.readyState === WebSocket.OPEN) ws.close();
		});
	}
}
