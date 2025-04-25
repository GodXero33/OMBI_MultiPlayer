import OMBIBotPlayer from "./player/player-bot.js";
import OMBIUserPlayer from "./player/player-user.js";

export default class OmbiGameManager {
	constructor (board) {
		this.board = board;
		this.currentChance = 0;
		this.roundFirst = 0;

		this.players = [
			new OMBIUserPlayer(board, 0),
			new OMBIBotPlayer(board, 1),
			new OMBIBotPlayer(board, 2),
			new OMBIBotPlayer(board, 3)
		];

		board.manager = this;
	}

	async dropCard (hand, isRoundStart = false) {
		if (hand == (this.roundFirst + 3) % 4) {
			await this.board.endRound();
			console.log(this.board.roundBestHand);
			this.roundFirst = this.board.roundBestHand;
			this.dropCard(this.roundFirst, true);
			return;
		}

		if (!isRoundStart) {
			this.currentChance = (this.currentChance + 1) % 4;
			this.players[(hand + 1) % 4].requestMove(hand + 1 === this.roundFirst);
		} else {
			this.players[hand].requestMove(hand === this.roundFirst);
		}
	}

	setPack (jsonData) {
		this.board.setPack(jsonData, this.players[0].symbol);
		this.players[0].setupCards();
	}
}
