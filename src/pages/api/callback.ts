export const prerender = false;

import type { APIRoute } from 'astro';

// The token is only handed to CMS pages on these origins, never to whichever page opened the popup.
const ALLOWED_ORIGINS = [
  'https://kystlaget.vercel.app',
  'https://gokstadkystlag.no',
  'https://www.gokstadkystlag.no',
];

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();
  const token = data.access_token;
  const provider = 'github';

  if (typeof token !== 'string' || token === '') {
    return new Response('Innloggingen mot GitHub feilet. Lukk vinduet og prøv igjen.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const forScript = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
  const message = `authorization:${provider}:success:${JSON.stringify({ token, provider })}`;

  const html = `<script>
    (function() {
      var allowedOrigins = ${forScript(ALLOWED_ORIGINS)};
      function recieveMessage(e) {
        if (allowedOrigins.indexOf(e.origin) === -1) return;
        window.opener.postMessage(${forScript(message)}, e.origin);
        window.removeEventListener("message", recieveMessage, false);
      }
      window.addEventListener("message", recieveMessage, false);
      window.opener.postMessage("authorizing:${provider}", "*");
    })()
  </script>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
};
