class Gameboard {
  constructor() {
    this.gameBoard = Array(9).fill("");
  }

  placeMark(index, symbol) {
    if (this.gameBoard[index] === "") {
      this.gameBoard[index] = symbol;
      return true;
    } else {
      console.log("Cette case est déjà occupée !");
      return false;
    }
  }

  init() {
    this.gameBoard.fill("");
  }

  getBoard() {
    return this.gameBoard;
  }

  displayGameBoard() {
    console.log(
      `${this.gameBoard.slice(0, 3).join(" | ")}\n---------\n` +
      `${this.gameBoard.slice(3, 6).join(" | ")}\n---------\n` +
      `${this.gameBoard.slice(6, 9).join(" | ")}\n`
    );
  }

  checkWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of lines) {
      if (this.gameBoard[a] && this.gameBoard[a] === this.gameBoard[b] && this.gameBoard[a] === this.gameBoard[c]) {
        return this.gameBoard[a];
      }
    }
    return null;
  }

  isBoardFull() {
    return this.gameBoard.every(cell => cell !== "");
  }
}

class Player {
  constructor(symbol) {
    this.symbol = symbol;
  }

  getSymbol() {
    return this.symbol;
  }
}

class GameController {
  constructor() {
    this.Game = new Gameboard();
    this.player1 = new Player("O");
    this.player2 = new Player("X");
    this.currentPlayer = this.player1;
    this.gameOver = false;

    this.turnBoxes = document.querySelectorAll('.turn-box');
    this.gridBoxes = document.querySelectorAll('.box');
    this.playAgainButton = document.getElementById('play-again');
    this.resultText = document.getElementById('resultat');
    this.overlay = document.getElementById('overlay');
    this.choiceDialog = document.getElementById('choice-dialog');
    this.symbolChoice = document.querySelectorAll('.symbol-choice');

    this.setupEventListeners();
    this.showChoiceDialog();
    this.updateTurnDisplay();
  }

  showChoiceDialog() {
    this.choiceDialog.showModal();
    document.body.classList.add('dialog-open');

    this.symbolChoice.forEach(box => box.addEventListener('click', () => {
      this.symbolChoice.forEach(btn => btn.classList.remove('active-choix'));
      box.classList.add('active-choix');
      this.currentPlayer = box.textContent === "O" ? this.player1 : this.player2;
      this.updateTurnDisplay();
      setTimeout(() => {
        this.choiceDialog.close();
        document.body.classList.remove('dialog-open');
      }, 300);
    }));
  }

  showDialog(message) {
    this.resultText.textContent = message;
    this.overlay.style.display = 'block';
  }

  hideDialog() {
    this.overlay.style.display = 'none';
  }

  updateTurnDisplay() {
    this.turnBoxes.forEach(box => box.classList.remove('active-turn'));
    document.getElementById(`turn-${this.currentPlayer.getSymbol()}`).classList.add('active-turn');
  }

  playTurn(index) {
    if (this.gameOver || !this.Game.placeMark(index, this.currentPlayer.getSymbol())) return;

    this.gridBoxes[index].textContent = this.currentPlayer.getSymbol();
    this.Game.displayGameBoard();

    let winner = this.Game.checkWinner();
    if (winner) {
      this.showDialog(`${winner} a gagné ! 🎉`);
      this.playAgainButton.style.display = 'block';
      this.gameOver = true;
      return;
    }

    if (this.Game.isBoardFull()) {
      this.showDialog("Match nul ! 😲");
      this.playAgainButton.style.display = 'block';
      return;
    }

    this.switchPlayer();
    this.updateTurnDisplay();
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  resetGame() {
    this.Game.init();
    this.gridBoxes.forEach(box => box.textContent = '');
    this.gameOver = false;
    this.currentPlayer = this.player1;
    this.hideDialog();
    this.updateTurnDisplay();
  }

  setupEventListeners() {
    this.gridBoxes.forEach((box, index) => {
      box.addEventListener('click', () => this.playTurn(index));
    });

    this.playAgainButton.addEventListener('click', () => this.resetGame());
    this.overlay.addEventListener('click', () => this.hideDialog());
  }
}

const gameController = new GameController();
