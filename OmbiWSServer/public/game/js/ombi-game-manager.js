import OMBIBotPlayer from "./player/player-bot.js";
import OMBIUserPlayer from "./player/player-user.js";

export default class OmbiGameManager {
	constructor (board) {
		this.board = board;
		this.currentChance = 0;

		this.players = [
			new OMBIUserPlayer(board, 0),
			new OMBIBotPlayer(board, 1),
			new OMBIBotPlayer(board, 2),
			new OMBIBotPlayer(board, 3)
		];

		board.manager = this;
	}

	dropCard (hand) {
		if (hand == 3) {
			console.log(true);
			return;
		}

		this.currentChance = (this.currentChance + 1) % 4;

		this.players[(hand + 1) % 4].requestMove();
	}

	setPack (jsonData) {
		this.board.setPack(jsonData, this.players[0].symbol);
		this.players[0].setupCards();
	}
}
