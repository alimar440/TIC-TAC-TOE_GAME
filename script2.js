class Gameboard {
  constructor() {
    this.gameBoard = ["", "", "", "", "", "", "", "", ""];
  }

  placeMark(a, c) {
    if (this.gameBoard[a] === "") {
      this.gameBoard[a] = c;
      return 1;
    } else {
      console.log("Cette case est déjà occupée !");
      return 0;
    }
  }

  init() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      this.gameBoard[i] = ""; 
    }
  }

  getBoard() {
    return this.gameBoard;
  }

  displayGameBoard() {
    console.log(
      `${this.gameBoard.slice(0, 3).join(" | ")}\n` +
      `---------\n` +
      `${this.gameBoard.slice(3, 6).join(" | ")}\n` +
      `---------\n` +
      `${this.gameBoard.slice(6, 9).join(" | ")}\n`
    );
  }

  checkWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (this.gameBoard[a] !== "" && this.gameBoard[a] === this.gameBoard[b] && this.gameBoard[a] === this.gameBoard[c]) {
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
  constructor(symb) {
    this.symbol = symb;
  }

  setSymbol(sym) {
    this.symbol = sym;
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
    this.gameOver = false;
    this.currentPlayer = this.player1;
    this.turnBoxes = document.querySelectorAll('.turn-box');
    this.gridBoxes = document.querySelectorAll('.box');
    this.playAgainButton = document.getElementById('play-again');
    this.resultText = document.getElementById('resultat');
    this.overlay = document.getElementById('overlay');
    this.choiceDialog = document.getElementById('choice-dialog');
    this.symbol_choice = document.querySelectorAll('.symbol-choice');
    this.init();
  }

  init() {
    this.choiceDialog.showModal();
    document.body.classList.add('dialog-open');

    this.symbol_choice.forEach(box => box.addEventListener('click', () => {
      this.symbol_choice.forEach(btn => btn.classList.remove('active-choix'));
      box.classList.add('active-choix');

      if (box.textContent === "O") {
        this.currentPlayer = this.player1;
      } else {
        this.currentPlayer = this.player2;
      }
      this.updateTurnDisplay();

      setTimeout(() => {
        this.choiceDialog.close();
        document.body.classList.remove('dialog-open');
      }, 300);
    }));

    this.playAgainButton.addEventListener('click', () => this.resetGame());
    this.gridBoxes.forEach((box, index) => {
      box.addEventListener('click', () => this.playTurn(index));
    });

    this.overlay.addEventListener('click', () => this.hideDialog());
    this.updateTurnDisplay();
  }

  showDialog(message) {
    this.resultText.textContent = message;
    this.resultText.style.display = 'block';
    this.overlay.style.display = 'block';
  }

  hideDialog() {
    this.resultText.style.display = 'none';
    this.overlay.style.display = 'none';
  }

  updateTurnDisplay() {
    this.turnBoxes.forEach(box => box.classList.remove('active-turn'));
    if (this.currentPlayer.getSymbol() === "O") {
      document.getElementById('turn-O').classList.add('active-turn');
    } else {
      document.getElementById('turn-X').classList.add('active-turn');
    }
  }

  playTurn(a) {
    if (this.gameOver) return;
    const result = this.Game.placeMark(a, this.currentPlayer.getSymbol());
    if (result === 0) return false;

    this.gridBoxes[a].textContent = this.currentPlayer.getSymbol();
    this.Game.displayGameBoard();

    let winner = this.Game.checkWinner();

    if (winner) {
      this.showDialog(`${winner} a gagné ! 🎉`);
      this.playAgainButton.style.display = 'block';
      this.playAgainButton.disabled = false;
      this.gameOver = true;
      return true;
    }

    if (this.Game.isBoardFull()) {
      this.showDialog("Match nul ! 😲");
      this.playAgainButton.style.display = 'block';
      this.playAgainButton.disabled = false;
      return true;
    }

    this.switchPlayer();
    this.updateTurnDisplay();
    return false;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  resetGame() {
    this.Game.init();
    this.hideDialog();
    this.gridBoxes.forEach(box => box.textContent = '');
    this.resultText.style.display = 'none';
    this.playAgainButton.style.display = 'none';
    this.playAgainButton.disabled = true;

    this.currentPlayer = this.player1;
    this.gameOver = false;
    this.updateTurnDisplay();
  }
}

const gameController = new GameController();
