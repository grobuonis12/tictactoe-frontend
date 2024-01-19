<template>
  <div>
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="w-10 h-10 border border-gray-300 flex items-center justify-center text-lg cursor-pointer m-1 transition duration-300 ease-in-out hover:bg-gray-200"
        @click="handleCellClick(rowIndex, colIndex)"
      >
        {{ cell }}
      </div>
    </div>

    <div>
      <h2>Action Log</h2>
      <ul>
        <li v-for="(action, index) in actionLog" :key="index">{{ action.action }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      currentPlayer: 'X',
      actionLog: [],
      gameFinished: false,
    };
  },

  methods: {
    async handleCellClick(row, col) {
      if (!this.gameFinished && this.board[row][col] === '') {
        this.board[row][col] = this.currentPlayer;

        await axios.post('/make-move', {
          row,
          col,
          player: this.currentPlayer,
        });

        this.fetchActionLog();

        if (this.checkWinner()) {
          this.actionLog.push({ action: `Player ${this.currentPlayer} wins!` });
          this.gameFinished = true;
        } else if (this.isBoardFull()) {
          this.actionLog.push({ action: 'It\'s a tie!' });
          this.gameFinished = true;
        } else {
          this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
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
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (this.board[row][col] === '') {
            return false;
          }
        }
      }
      return true;
    },

    async fetchActionLog() {
      try {
        const response = await axios.get('/get-action-log');
        this.actionLog = response.data;
      } catch (error) {
        console.error('Error fetching action log:', error);
      }
    },
  },

  created() {
    this.fetchActionLog();
  },
};
</script>

<style scoped>
/* Additional component-specific styles go here */
</style>
