export default async (request, context) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Strip /api/ prefix and forward to Bland AI
  const url = new URL(request.url);
  const blandPath = url.pathname.replace(/^\/api/, '') + url.search;
  const target = 'https://api.bland.ai/v1' + blandPath;

  // Clone request with Bland AI target
  const modifiedHeaders = new Headers(request.headers);
  modifiedHeaders.delete('origin'); // prevent Bland from seeing browser origin
  modifiedHeaders.delete('referer');

  const response = await fetch(target, {
    method: request.method,
    headers: modifiedHeaders,
    body: request.body
  });

  // Clone response and inject CORS headers
  const corsHeaders = new Headers(response.headers);
  corsHeaders.set('Access-Control-Allow-Origin', '*');
  corsHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  corsHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: corsHeaders
  });
};
