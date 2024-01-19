// tictactoe-frontend/tests/unit/TicTacToe.spec.js
import { shallowMount } from '@vue/test-utils';
import TicTacToe from '@/components/TicTacToe.vue';

describe('TicTacToe.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(TicTacToe);
    expect(wrapper.exists()).toBe(true);
  });

  // Add more meaningful tests as needed
});
