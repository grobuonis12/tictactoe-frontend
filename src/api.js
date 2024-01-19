// tictactoe-frontend/src/api.js

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Update the URL to match your Laravel API endpoint
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default {
    makeMove(cell) {
        return apiClient.post('/makeMove', { cell });
    },

    getActionLog() {
        return apiClient.get('/getActionLog');
    },
    // Add other methods as needed
};
