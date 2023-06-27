const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    // Replace this with real commands
    // Screen.addCommand('down', 'Moves the cursor down', this.cursor.down.bind(this.cursor));
    // Screen.addCommand('up', 'Moves the cursor down', this.cursor.down.bind(this.cursor));
    Screen.addCommand('left', 'Moves the cursor down', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'Moves the cursor down', this.cursor.right.bind(this.cursor));
    Screen.addCommand('x', 'Places X in the column', this.placeMove.bind(this, 'X'));
    Screen.addCommand('o', 'Places O in the column', this.placeMove.bind(this, 'O'));

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  placeMove(char) {
    const grid = Screen.grid;
    const currentCol = this.cursor.col;
    if (char === 'X') Screen.setMessage(`It is O's turn now.`)
    else Screen.setMessage(`It is X's turn now.`)
    for (let row = grid.length - 1; row >= 0; row--) {
      if (grid[row][currentCol] === ' ') {
        Screen.setGrid(row, currentCol, char);
        const checkWinner = ConnectFour.checkWin(Screen.grid);
        if (checkWinner) ConnectFour.endGame(checkWinner);
        Screen.render();
        return;
      }
    }
  }

  static checkWin(grid) {
    //rotate matrix
    const rotate = (grid) => {
      let rotated = [];
      const [width, height] = [grid[0].length, grid.length];
      for (let col = 0; col < width; col++) {
        let rowOfCols = []
        for (let row = 0; row < height; row++) {
          rowOfCols.push(grid[row][col])
        }
        rotated.push(rowOfCols)
      }
      return rotated;
    }
    const horizontalWin = getLinearWin(grid);
    if (horizontalWin) return horizontalWin;
    const rotatedGrid = rotate(grid);
    const verticalWin = getLinearWin(rotatedGrid)
    if (verticalWin) return verticalWin;
    //Check horizontal
    // for (let row = 0; row < grid.length; row++) {
    //   let rowsOfFours = []
    //   let startIdx = 0;
    //   while (startIdx <= (grid[row].length - 4)) {
    //     let endIndx = startIdx + 4;
    //     let fourElRow = grid[row].slice(startIdx, endIndx);
    //     if (fourElRow.length === 4) rowsOfFours.push(fourElRow);
    //     startIdx++;
    //   }
    //   const winnerRow = rowsOfFours.find(row => row.every(el => el === row[0] && el !== ' '));
    //   if (winnerRow) return winnerRow[0];
    // }
    function getLinearWin (grid) {
      for (let row = 0; row < grid.length; row++) {
        let rowsOfFours = []
        let startIdx = 0;
        while (startIdx <= (grid[row].length - 4)) {
          let endIndx = startIdx + 4;
          let fourElRow = grid[row].slice(startIdx, endIndx);
          if (fourElRow.length === 4) rowsOfFours.push(fourElRow);
          startIdx++;
        }
        const winnerRow = rowsOfFours.find(row => row.every(el => el === row[0] && el !== ' '));
        if (winnerRow) return winnerRow[0];
      }
    }
    //Check Vertical
    // let rotatedGrid = rotate(grid);
    // for (let row = 0; row < rotatedGrid.length; row++) {
    //   let rowsOfFours = []
    //   let startIdx = 0;
    //   while (startIdx <= (rotatedGrid[row].length - 4)) {
    //     let endIndx = startIdx + 4;
    //     let fourElRow = rotatedGrid[row].slice(startIdx, endIndx);
    //     if (fourElRow.length === 4) rowsOfFours.push(fourElRow);
    //     startIdx++;
    //   }
    //   const winnerRow = rowsOfFours.find(row => row.every(el => el === row[0] && el !== ' '));
    //   if (winnerRow) return winnerRow[0];
    // }
    // blank grid
    if (grid.every(row => row.every(col => col === ' '))) return false;

    //Check left diagonal
    const [height, width] = [grid.length, grid[0].length]
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            let currentRow = row;
            let currentCol = col;
            let diagonals = [];
            while (currentRow < height && currentCol < width) {
                diagonals.push(grid[currentRow][currentCol])
                currentRow++;
                currentCol++;
            }
            if (diagonals.length === 4 && diagonals.every(el => el === diagonals[0] && el !== ' ')) return diagonals[0];
        }
    }

    //Check right diagonals
    for (let row = 0; row < height; row++) {
      for (let col = width; col >- 0; col--) {
          let currentRow = row;
          let currentCol = col;
          let diagonals = [];
          while (currentRow < height && currentCol >= 0) {
              diagonals.push(grid[currentRow][currentCol])
              currentRow++;
              currentCol--;
          }
          if (diagonals.length === 4 && diagonals.every(el => el === diagonals[0] && el !== ' ')) return diagonals[0];
      }
  }
  //Check ties
  if (grid.every(row => row.every(col => col !== ' '))) return 'T';

  return false;
    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended

  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;
