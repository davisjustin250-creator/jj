export default async (request, context) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Target-URL'
      }
    });
  }

  const target = request.headers.get('X-Target-URL') || 'https://api.bland.ai/v1' + new URL(request.url).pathname;
  
  const response = await fetch(target, {
    method: request.method,
    headers: {
      'Authorization': request.headers.get('Authorization'),
      'Content-Type': 'application/json'
    },
    body: request.body
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
