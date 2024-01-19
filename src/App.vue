<!-- App.vue -->

<template>
  <div>
    <TicTacToe />
  </div>
</template>

<script>
import TicTacToe from './components/TicTacToe.vue';

export default {
  name: 'App',
  components: {
    TicTacToe,
  },
};
</script>

<style scoped>
/* Additional component-specific styles go here */
</style>
