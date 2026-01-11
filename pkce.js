// pkce.js - funciones PKCE (verifier & challenge)
// Guarda este archivo como pkce.js en la misma carpeta que index.html y callback.html
const pkce = (() => {
  function base64urlEncode(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function randomString(length = 96) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    // devolvemos base64url del array aleatorio
    return base64urlEncode(array);
  }

  async function generateChallenge(verifier) {
    const enc = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return base64urlEncode(digest);
  }

  function generateVerifier() {
    return randomString(64);
  }

  return { generateVerifier, generateChallenge };
})();

if (typeof module !== 'undefined') module.exports = pkce;