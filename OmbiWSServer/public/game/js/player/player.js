export default class OMBIPlayer {
	constructor (board, symbol) {
		this.board = board;
		this.symbol = symbol;
		this.pack = this.board.playerPacks[this.symbol];
	}

	requestMove () {}
}
