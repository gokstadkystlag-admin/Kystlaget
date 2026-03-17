export const prerender = false;

import type { APIRoute } from 'astro';

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

  const html = `<script>
    (function() {
      function recieveMessage(e) {
        console.log("recieveMessage %o", e);
        window.opener.postMessage(
          'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
          e.origin
        );
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
