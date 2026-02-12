export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { code, code_verifier, redirect_uri } = req.body;

        // Validar que tenemos todos los parámetros
        if (!code) {
            return res.status(400).json({ error: 'Missing authorization code' });
        }
        if (!code_verifier) {
            return res.status(400).json({ error: 'Missing PKCE code_verifier' });
        }
        if (!redirect_uri) {
            return res.status(400).json({ error: 'Missing redirect_uri' });
        }

        // Credenciales de Kick (NUNCA las expongas en GitHub)
        const clientId = '01KDEK0SYBAFYPBHRCFWJ7GTXC';
        const clientSecret = '924f7d39c5770f3371190d2e19e41c941488aa640df7af8e3573ca4416d440bd';

        // Construir parámetros para el endpoint de token de Kick
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('redirect_uri', redirect_uri);
        params.append('code_verifier', code_verifier);  // Importante para PKCE

        console.log('Intercambiando código por token...');
        console.log('Redirect URI:', redirect_uri);

        // Hacer la petición a Kick
        const response = await fetch('https://kick.com/api/v2/oauth2/token', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString(),
        });

        const data = await response.json();

        // Si Kick devuelve error
        if (!response.ok) {
            console.error('Kick error:', data);
            return res.status(response.status).json({ 
                error: data.error || 'Token exchange failed',
                details: data.error_description || ''
            });
        }

        // Éxito - devolver el token al cliente
        console.log('Token obtenido exitosamente');
        return res.status(200).json({
            access_token: data.access_token,
            token_type: data.token_type || 'Bearer',
            expires_in: data.expires_in,
            refresh_token: data.refresh_token || null
        });

    } catch (error) {
        console.error('Token exchange error:', error);
        return res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.message 
        });
    }
}
