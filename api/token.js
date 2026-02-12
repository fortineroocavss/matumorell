const axios = require('axios');

const getToken = async () => {
    try {
        const response = await axios.post('https://kick.com/api/v2/oauth2/token', {
            client_id: '01KDEK0SYBAEFYPBHRCFW7GTXC',
            client_secret: '924f7d39c5770f3371190d2e19e41c941488aa640df7af8e3573ca4416d440bd'
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching token:', error);
    }
};

module.exports = getToken;