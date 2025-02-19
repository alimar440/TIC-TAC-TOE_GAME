// Création de la logique du jeu de Tic Tac Toe
function Gameboard() {
  const gameBoard = ["", "", "", "", "", "", "", "", ""];

  const placeMark = (a, c) => {
    if (gameBoard[a] === "") {
      gameBoard[a] = c;
      return 1;
    } else {
      console.log("Cette case est déjà occupée !");
      return 0;
    }
  };

  const init = () => {
    for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = ""; 
    }
  };

  const getBoard = () => gameBoard;

  const displayGameBoard = () => {
    console.log(
      `${gameBoard.slice(0, 3).join(" | ")}\n` +
      `---------\n` +
      `${gameBoard.slice(3, 6).join(" | ")}\n` +
      `---------\n` +
      `${gameBoard.slice(6, 9).join(" | ")}\n`
    );
  };

  const checkWinner = () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
      [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (gameBoard[a] !== "" && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        return gameBoard[a]; 
      }
    }
    return null;
  };

  const isBoardFull = () => {
    return gameBoard.every(cell => cell !== "");
  };

  return { placeMark, displayGameBoard, getBoard, init, checkWinner, isBoardFull };
}

function player(symb) {
  let symbol = symb;  
  const setSymbol = (sym) => { symbol = sym; };  
  const getSymbol = () => symbol; 
  return {setSymbol, getSymbol };
}


const GameController = (function() {
  const Game = Gameboard();
  let player1 = player("O");
  let player2 = player("X");
  let currentPlayer = player1;
  let gameOver = false;
  const turnBoxes = document.querySelectorAll('.turn-box');
  const gridBoxes = document.querySelectorAll('.box');
  const playAgainButton = document.getElementById('play-again');
  const resultText = document.getElementById('resultat');
  const overlay = document.getElementById('overlay');

  function showDialog(message) {
      resultText.textContent = message;
      resultText.style.display = 'block';
      overlay.style.display = 'block';
  }

  function hideDialog() {
      resultText.style.display = 'none';
      overlay.style.display = 'none';
  }
  
  const updateTurnDisplay = () => {
    turnBoxes.forEach(box => box.classList.remove('active-turn'));
    if (currentPlayer.getSymbol() === "O") {
      document.getElementById('turn-O').classList.add('active-turn');
    } else {
      document.getElementById('turn-X').classList.add('active-turn');
    }
  };

  const playTurn = (a) => {
    if (gameOver) return;
    const result = Game.placeMark(a, currentPlayer.getSymbol());
    if (result === 0) return false;
    

    
    gridBoxes[a].textContent = currentPlayer.getSymbol(); 
    
    Game.displayGameBoard(); 
    
    let winner = Game.checkWinner();
    
    if (winner) {
      showDialog(`${winner} a gagné ! 🎉`);
      resultText.style.display = 'block';
      playAgainButton.style.display = 'block';
      playAgainButton.disabled = false;
      gameOver = true;
      return true;
    }

    if (Game.isBoardFull()) {
      showDialog("Match nul ! 😲");
      resultText.style.display = 'block';
      playAgainButton.style.display = 'block';
      playAgainButton.disabled = false;
      return true;
    }

    switchPlayer();
    updateTurnDisplay();
    return false;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  
  gridBoxes.forEach((box, index) => {
    box.addEventListener('click', () => playTurn(index));
  });

  

  playAgainButton.addEventListener('click', () => {
    Game.init();
    hideDialog();
    gridBoxes.forEach(box => box.textContent = '');
    resultText.style.display = 'none';
    
    playAgainButton.style.display = 'none';
    playAgainButton.disabled = true;

    currentPlayer = player1;
    gameOver = false ;
    updateTurnDisplay();
});

  
  updateTurnDisplay();
  overlay.addEventListener('click', hideDialog);

  return { playTurn };
})();
