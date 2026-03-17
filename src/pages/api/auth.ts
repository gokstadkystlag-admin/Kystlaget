export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
  return Response.redirect(redirectUrl, 301);
};
