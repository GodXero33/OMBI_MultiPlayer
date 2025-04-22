import Board from "./board.js";

const board = new Board(document.getElementById('cards-cont'));

board.setupCards();

window.addEventListener('click', () => {
	board.clearCards().then(res => console.log(res)).catch(error => console.error(error));
});
