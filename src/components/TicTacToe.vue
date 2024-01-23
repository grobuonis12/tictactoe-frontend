<template>
  <div>
    <h1>Tic Tac Toe</h1>
    <p v-if="!gameFinished">Current Turn: Player {{ currentPlayer }}</p>
    <table>
      <tr v-for="(row, rowIndex) in board" :key="rowIndex">
        <td
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{ vert: colIndex !== 2, hori: rowIndex !== 2 }"
          @click="handleCellClick(rowIndex, colIndex)"
        >
          {{ cell }}
        </td>
      </tr>
    </table>

    <div class="button-container">
      <button @click="startNewGame">Start New Game</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      board: this.loadGameBoard() || [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      currentPlayer: this.loadCurrentPlayer() || 'X',
      gameFinished: false,
      totalMoves: 0,
      isProcessing: false,
    };
  },

  methods: {
    async handleCellClick(row, col) {
      // Check if the game is not finished, the cell is empty, and not processing
      if (!this.gameFinished && this.board[row][col] === '' && !this.isProcessing) {
        this.isProcessing = true; // Set the flag to indicate processing

        this.board[row][col] = this.currentPlayer;
        this.totalMoves++;

        try {
          const response = await axios.post('http://localhost:8000/make-move', {
            row,
            col,
            player: this.currentPlayer,
          });

          // Fetch the updated board from the server
          await this.fetchBoard();

          // Save the game state to localStorage
          this.saveGameBoard();
          this.saveCurrentPlayer();

          // Check if the response indicates an error
          if (response.data.error) {
            console.error('Server error:', response.data.error);
            // Handle the error as needed
          }

        } catch (error) {
          console.error('Error making move:', error);
        } finally {
          this.isProcessing = false; // Reset the flag after processing
        }

        if (this.checkWinner()) {
          alert(`Player ${this.currentPlayer} wins!`);
          this.startNewGame();
        } else if (this.isBoardFull()) {
          alert('It\'s a tie!');
          this.startNewGame();
        } else {
          this.switchPlayer();
        }
      }
    },

    checkWinner() {
      // Check rows, columns, and diagonals for a winner
      for (let i = 0; i < 3; i++) {
        if (
          this.board[i][0] === this.currentPlayer &&
          this.board[i][1] === this.currentPlayer &&
          this.board[i][2] === this.currentPlayer
        ) {
          return true;
        }
        if (
          this.board[0][i] === this.currentPlayer &&
          this.board[1][i] === this.currentPlayer &&
          this.board[2][i] === this.currentPlayer
        ) {
          return true;
        }
      }

      if (
        this.board[0][0] === this.currentPlayer &&
        this.board[1][1] === this.currentPlayer &&
        this.board[2][2] === this.currentPlayer
      ) {
        return true;
      }
      if (
        this.board[0][2] === this.currentPlayer &&
        this.board[1][1] === this.currentPlayer &&
        this.board[2][0] === this.currentPlayer
      ) {
        return true;
      }

      return false;
    },

    isBoardFull() {
      // Check if all cells are filled
      return this.totalMoves === 9;
    },

    startNewGame() {
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
      this.currentPlayer = 'X';
      this.gameFinished = false;
      this.totalMoves = 0;

      // Clear the saved game state in localStorage
      this.clearSavedGameState();
    },

    async fetchBoard() {
      try {
        const response = await axios.get('http://localhost:8000/get-board');
        this.board = response.data.board;
        // Update other properties if needed
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    },

    switchPlayer() {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    },

    saveGameBoard() {
      localStorage.setItem('ticTacToeBoard', JSON.stringify(this.board));
    },

    loadGameBoard() {
      const savedBoard = localStorage.getItem('ticTacToeBoard');
      return savedBoard ? JSON.parse(savedBoard) : null;
    },

    saveCurrentPlayer() {
      localStorage.setItem('ticTacToeCurrentPlayer', this.currentPlayer);
    },

    loadCurrentPlayer() {
      return localStorage.getItem('ticTacToeCurrentPlayer') || null;
    },

    clearSavedGameState() {
      localStorage.removeItem('ticTacToeBoard');
      localStorage.removeItem('ticTacToeCurrentPlayer');
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
}

table {
  margin: 5px auto;
}

.cell {
  width: 100px;
  height: 100px;
  border: 2px solid black;
  text-align: center;
  font-size: 2rem;
  cursor: pointer;
}

.vert {
  border-left: 2px solid black;
  border-right: 2px solid black;
}

.hori {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}

.button-container {
  margin-top: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
