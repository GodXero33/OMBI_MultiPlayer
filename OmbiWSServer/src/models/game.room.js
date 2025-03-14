export class GameRoom {
	constructor (ids) {
		this.waitingIds = ids;
		this.clients = [];
		this.isOpen = true;
	}

	addClient (client) {
		this.clients.push(client);
		client.setRoom(this);
		this.waitingIds.splice(this.waitingIds.indexOf(client.id), 1);
	}

	testClient (client) {
		const matchingId = this.waitingIds.find(id => id == client.id);
	
		if (matchingId) {
			this.addClient(client);
		}
	}

	testClients (clients) {
		if (this.isFull()) return;

		clients.forEach(client => this.testClient(client));
	}

	isFull () {
		return this.clients.length == 2;
	}

	log () {
		console.log('ROOM: {');
		console.log(this.waitingIds);
		console.log('clients: ');
		
		this.clients.forEach(client => console.log(client.id));

		console.log('}');
	}

	close () {
		if (!this.isOpen) return;

		this.isOpen = false;

		this.clients.forEach(client => {
			const ws = client.ws;

			if (ws && ws.readyState === WebSocket.OPEN) ws.close();
		});
	}
}
