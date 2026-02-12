const fetch = require('node-fetch');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const clientId = '01KDEK0SYBAEFYPBHRCFW7GTXC';
        const clientSecret = '924f7d39c5770f3371190d2e19e41c941488aa640df7af8e3573ca4416d440bd';

        const body = new URLSearchParams();
        body.append('client_id', clientId);
        body.append('client_secret', clientSecret);
        body.append('grant_type', 'client_credentials');

        try {
            const response = await fetch('https://kick.com/api/v2/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body,
            });

            const data = await response.json();
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}