// api/token.js - Vercel Serverless (Node)
// Deploy en Vercel y configura las env vars:
// KICK_CLIENT_ID y KICK_CLIENT_SECRET

avss.github.io  
   Guardas y redeployas si te lo pide.  
4. Una vez desplegado, copia la URL que te da Vercel (ej. https://mi-proyecto.vercel.app) y edita callback.html en tu repo para que use:
   const VERCEL_API = 'https://TU_PROYECTO.vercel.app/api/token';
   Commit → push → espera el redeploy.

Si quieres, te voy guiando paso a paso:
- ¿Subimport fetch from 'node-fetch';

export default async function handler(req, res) {
  const ORIGIN = process.env.ALLOWED_ORIGIN || 'https://fortineroocavss.github.io';
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { code, redirect_uri } = req.body || {};
  if (!code || !redirect_uri) return res.status(400).json({ error: 'missing_code_or_redirect_uri' });

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.KICK_CLIENT_ID,
    client_secret: process.env.KICK_CLIENT_SECRET,
    code,
    redirect_uri
  });

  try {
    const r = await fetch('https://id.kick.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const text = await r.text();
    res.status(r.status).setHeader('Content-Type', 'application/json').end(text);
  } catch (err) {
    console.error('token request failed', err);
    res.status(500).json({ error: 'token_request_failed', details: String(err) });
  }
}
